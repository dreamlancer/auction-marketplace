//test1
//Can safeTransferFrom your own coin to valid contract
//This is where we use our ValidReceiver contract. Deploy that contract and send a token to it. If the transaction doesn’t fail and the contract is the new owner, then this test passes.

//test2
//Can’t safeTransferFrom your own coin to invalid contract
//Similar to the last test, but we deploy our InvalidReceiver and when we send a token to it we expect the transaction to fail.
