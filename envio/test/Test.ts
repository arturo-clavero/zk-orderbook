import assert from "assert";
import { 
  TestHelpers,
  Deposit_Deposit
} from "generated";
const { MockDb, Deposit } = TestHelpers;

describe("Deposit contract Deposit event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Deposit contract Deposit event
  const event = Deposit.Deposit.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Deposit_Deposit is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Deposit.Deposit.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualDepositDeposit = mockDbUpdated.entities.Deposit_Deposit.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedDepositDeposit: Deposit_Deposit = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      user: event.params.user,
      token: event.params.token,
      amount: event.params.amount,
      txHash: event.transaction.hash,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualDepositDeposit, expectedDepositDeposit, "Actual DepositDeposit should be the same as the expectedDepositDeposit");
  });
});
