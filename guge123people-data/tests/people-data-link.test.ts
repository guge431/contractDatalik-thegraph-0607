import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { FallbackData } from "../generated/schema"
import { FallbackData as FallbackDataEvent } from "../generated/PeopleDataLink/PeopleDataLink"
import { handleFallbackData } from "../src/people-data-link"
import { createFallbackDataEvent } from "./people-data-link-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let msgValue = BigInt.fromI32(234)
    let Data = Bytes.fromI32(1234567890)
    let newFallbackDataEvent = createFallbackDataEvent(sender, msgValue, Data)
    handleFallbackData(newFallbackDataEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("FallbackData created and stored", () => {
    assert.entityCount("FallbackData", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FallbackData",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "FallbackData",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "msgValue",
      "234"
    )
    assert.fieldEquals(
      "FallbackData",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "Data",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
