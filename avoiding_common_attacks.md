# Security features

## Avoiding Denial of Service with Failed Call

Reminder: This problem occurs around the transfer function where the recipient could be a contract with a fallback function implemented that would reject the payment and paralyzes the contract.

To solve, I have implemented a withdrawal pattern for both bidders and NFT winners. Any ether or NFT transfer is independent from the other app logic.

The contract favors pulls over pushfor external calls. If a current highestBidder gets overbid, the previous highestBid is placed into an array of pending returns so that bidders can withdraw their ethers "manually" once the auction has ended.

## Avoiding Integer Overflow and Underflow

Reminder: Overflow/underflow happens when uint are incremented or decremented past their limits.
Max value for a uint is 2^256-1. If an integer increments past that number, it will overflow, and the value will go back to 0.

The contract uses the SafeMath library from OpenZeppelin to prevent integer overflow and underflow upon deposit and withdrawal of ether amounts.
SafeMath reverts any function that is called that would prevent an overflow or underflow.

## Avoiding Re-entracy Attacks

Reminder: Reentrancy occurs when a function can be called repeatedly, before the first invocation of the function was finished.
As such, balances can be withdrawn multiple times for instance.

To avoid, state changes should happen before external calls.
In the withdrawNft, withdrawBid and withdrawHighestBid functions, I have made sure to do all the internal work before calling an external function.
