import './App.css';
import { ethers } from 'ethers'
import { toUtf8Bytes, hexlify } from 'ethers';
import { useQuery } from '@tanstack/react-query'
import { gql, request, GraphQLClient } from 'graphql-request'
import { useEffect, useState } from 'react';

const url = 'https://api.studio.thegraph.com/query/113379/people-data/version/latest'
const CONTRACTS = {
  address: "0x6d9A86CDAd6D46B90E05D503124229dA3b7059c4",
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "msgValue",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "Data",
          "type": "bytes"
        }
      ],
      "name": "FallbackData",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "age",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "sex",
              "type": "string"
            }
          ],
          "indexed": false,
          "internalType": "struct PeopleDataLink.peopleData[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "name": "GetAllPeopleDataInfo",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "sex",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "GetPeopleDataInfo",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "msgValue",
          "type": "uint256"
        }
      ],
      "name": "receiveData",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "peopleInfos",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "sex",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "stateMutability": "payable",
      "type": "receive",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_age",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_sex",
          "type": "string"
        }
      ],
      "name": "setPeopleData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllPeopleData",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "age",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "sex",
              "type": "string"
            }
          ],
          "internalType": "struct PeopleDataLink.peopleData[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
}

const GET_ALL_PEOPLE_DATA = `
  query GetAllPeopleData {
    getPeopleDataInfos(first: 5,orderBy: blockTimestamp, orderDirection: desc) {
      id
      user
      name
      age
      sex
    }
  }
`;

export default function App() {
  const [peopleData, setPeopleData] = useState({
    name: '',
    age: '',
    sex: '',
  })
  const [content, setContent] = useState([])
  const [account, setAccount] = useState('')
  const [signer, setSigner] = useState('')
  const [status, setStatus] = useState(false)

  //连接钱包
  const onConnect = async () => {
    if (!window.ethereum) {
      alert('请安装 MetaMask 或其他支持 Ethereum 的钱包')
    } else {
      try {
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(111, account)
        setAccount(account[0]);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();

      } catch {
        console.log('连接钱包失败,连接不上matemask')
      }
    }
  }
  //提交作业1
  const submitOne = async () => {
    const jsonString = JSON.stringify(peopleData);
    const hexData = hexlify(toUtf8Bytes(jsonString));
    console.log('数据提交1', peopleData)
    try {
      //进行交易
      const tx = await signer.sendTransaction({
        to: "0x0000000000000000000000000000000000000000",
        value: 0,
        data: hexData
      });
      console.log('交易的hash地址', tx.hash)
    } catch {
      console.log('交易的失败')
    }
    setPeopleData({
      name: '',
      age: '',
      sex: '',
    })
  }
  //提交作业2
  const submitTwo = async () => {
    console.log('数据提交2', peopleData)
    // return
    setStatus(true)
    const { name, age, sex } = peopleData
    console.log('数据提交2', name, age, sex)
    const contract = new ethers.Contract(CONTRACTS.address, CONTRACTS.abi, signer);
    try {
      const sumitData = await contract.setPeopleData(name, age, sex)
      console.log('储存成功', sumitData.hash)
    } catch {
      console.log('储存失败')
    }
    setPeopleData({
      name: '',
      age: '',
      sex: '',
    })
  
  setTimeout(() => {
  
     showSubmitTwo()
  }, 3000); 
   
  }
  const showSubmitTwo = async () => {
    const result = await request(url, GET_ALL_PEOPLE_DATA, {});
    setContent(result.getPeopleDataInfos)
    console.log(999999999, result.getPeopleDataInfos)
    setStatus(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPeopleData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  return (
    <div className="App">
      <h1 className="app-title">数据上链</h1>
      {!account ? (
        <button
          className="submit-button submit-button-secondary"
          onClick={onConnect}
        >
          🦊 连接 MetaMask 钱包
        </button>
      ) : (
        <div>
          <div className="form-container">
            {/* 输入框 */}
            <div className="input-group">
              <label className="input-label">人名</label>
              <input
                type="text"
                name="name"
                value={peopleData.name}
                onChange={handleInputChange}
                placeholder="请输入人名"
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label className="input-label">性别</label>
              <input
                type="text"
                name="sex"
                value={peopleData.sex}
                onChange={handleInputChange}
                placeholder="请输入性别"
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label className="input-label">年龄</label>
              <input
                type="number"
                name="age"
                value={peopleData.age}
                onChange={handleInputChange}
                placeholder="请输入年龄"
                className="form-input"
              />
            </div>
          </div>
          {/* 作业按钮 */}
          <div className="button-container">
            <button onClick={submitOne} className="submit-button submit-button-primary">
              作业1
            </button>
            <button disabled={status} onClick={submitTwo} className="submit-button submit-button-secondary">
              作业2
            </button>
          </div>
          {/* 数据展示框 */}
          <div className="display-container">
            <label className="display-label">数据展示</label>
            {status ? (
              <div>数据获取中........</div>
            ) : (
              <div>
                {content.map(item => (
                  <div style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    overflowWrap: 'break-word'
                  }} className="form-input" key={item.id} >{JSON.stringify(item)}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}