import {
  FallbackData as FallbackDataEvent,
  GetAllPeopleDataInfo as GetAllPeopleDataInfoEvent,
  GetPeopleDataInfo as GetPeopleDataInfoEvent,
  receiveData as receiveDataEvent
} from "../generated/PeopleDataLink/PeopleDataLink"
import {
  FallbackData,
  GetAllPeopleDataInfo,
  GetPeopleDataInfo,
  receiveData
} from "../generated/schema"
import { Bytes } from "@graphprotocol/graph-ts"

export function handleFallbackData(event: FallbackDataEvent): void {
  let entity = new FallbackData(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.msgValue = event.params.msgValue
  entity.Data = event.params.Data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGetAllPeopleDataInfo(
  event: GetAllPeopleDataInfoEvent
): void {
  let entity = new GetAllPeopleDataInfo(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.param1 = changetype<Bytes[]>(event.params.param1)

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGetPeopleDataInfo(event: GetPeopleDataInfoEvent): void {
  let entity = new GetPeopleDataInfo(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.name = event.params.name
  entity.age = event.params.age
  entity.sex = event.params.sex
  entity.internal_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlereceiveData(event: receiveDataEvent): void {
  let entity = new receiveData(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.msgValue = event.params.msgValue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
