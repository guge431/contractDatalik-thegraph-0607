// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract PeopleDataLink {

    struct peopleData {
        string name;
        uint256 id;
        uint256 age;
        string sex;
    }

    peopleData[] public peopleInfos;

    //事件日志获取人
    event GetPeopleDataInfo(address indexed user,string name,uint256 age,string sex,uint256 id);
    //设置人
    function setPeopleData(string calldata _name ,uint256 _age,string calldata _sex) public {
        uint256 _id=uint256(keccak256(abi.encodePacked(block.timestamp,msg.sender)));
        peopleInfos.push(peopleData({
            name:_name,
            id:_id,
            age:_age,
            sex:_sex
        }));
        emit GetPeopleDataInfo(msg.sender, _name,_age,_sex,_id);
    }

    event GetAllPeopleDataInfo(address indexed user,peopleData[]);
    // 获取人总数据
    function getAllPeopleData() public returns(peopleData[] memory) {
        emit GetAllPeopleDataInfo(msg.sender, peopleInfos);
        return peopleInfos ;
    }

    // receive函数
    event receiveData(address indexed sender,uint256 msgValue);
    receive() external payable{
        emit receiveData(msg.sender,msg.value);
    }
    //fallback函数
    event FallbackData(address indexed sender,uint256 msgValue,bytes Data);
   
    fallback() external payable{
      emit FallbackData(msg.sender,msg.value,msg.data);
    }
}