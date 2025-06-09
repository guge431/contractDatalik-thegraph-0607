import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  FallbackData,
  GetAllPeopleDataInfo,
  GetPeopleDataInfo,
  receiveData
} from "../generated/PeopleDataLink/PeopleDataLink"

export function createFallbackDataEvent(
  sender: Address,
  msgValue: BigInt,
  Data: Bytes
): FallbackData {
  let fallbackDataEvent = changetype<FallbackData>(newMockEvent())

  fallbackDataEvent.parameters = new Array()

  fallbackDataEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  fallbackDataEvent.parameters.push(
    new ethereum.EventParam(
      "msgValue",
      ethereum.Value.fromUnsignedBigInt(msgValue)
    )
  )
  fallbackDataEvent.parameters.push(
    new ethereum.EventParam("Data", ethereum.Value.fromBytes(Data))
  )

  return fallbackDataEvent
}

export function createGetAllPeopleDataInfoEvent(
  user: Address,
  param1: Array<ethereum.Tuple>
): GetAllPeopleDataInfo {
  let getAllPeopleDataInfoEvent =
    changetype<GetAllPeopleDataInfo>(newMockEvent())

  getAllPeopleDataInfoEvent.parameters = new Array()

  getAllPeopleDataInfoEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  getAllPeopleDataInfoEvent.parameters.push(
    new ethereum.EventParam("param1", ethereum.Value.fromTupleArray(param1))
  )

  return getAllPeopleDataInfoEvent
}

export function createGetPeopleDataInfoEvent(
  user: Address,
  name: string,
  age: BigInt,
  sex: string,
  id: BigInt
): GetPeopleDataInfo {
  let getPeopleDataInfoEvent = changetype<GetPeopleDataInfo>(newMockEvent())

  getPeopleDataInfoEvent.parameters = new Array()

  getPeopleDataInfoEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  getPeopleDataInfoEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  getPeopleDataInfoEvent.parameters.push(
    new ethereum.EventParam("age", ethereum.Value.fromUnsignedBigInt(age))
  )
  getPeopleDataInfoEvent.parameters.push(
    new ethereum.EventParam("sex", ethereum.Value.fromString(sex))
  )
  getPeopleDataInfoEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return getPeopleDataInfoEvent
}

export function createreceiveDataEvent(
  sender: Address,
  msgValue: BigInt
): receiveData {
  let receiveDataEvent = changetype<receiveData>(newMockEvent())

  receiveDataEvent.parameters = new Array()

  receiveDataEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  receiveDataEvent.parameters.push(
    new ethereum.EventParam(
      "msgValue",
      ethereum.Value.fromUnsignedBigInt(msgValue)
    )
  )

  return receiveDataEvent
}
