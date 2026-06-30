# Command: /review-proposal

## Purpose
Decode a pending multisig proposal into plain English and give a SAFE / WATCH / BLOCK verdict.

## When to use
- A signer asks "what does this proposal do?"
- Before a signing ceremony.
- When a durable nonce or unfamiliar program is detected.

## Steps
1. Get the proposal transaction or proposal index from the user.
2. Run `tools/decode-proposal.ts <input>`.
3. Run `tools/check-durable-nonce.ts` if the transaction is serialized.
4. Simulate the transaction if RPC and wallet are configured.
5. Cross-check red flags from `skill/intent-review.md`.
6. Return a human-readable summary and verdict.

## Output format
```markdown
## Proposal Review: <id>
### Intent
<one-paragraph summary>

### Programs called
<list>

### Authority / value impact
<description>

### Durable nonce?
<yes/no + details>

### Verdict: SAFE / WATCH / BLOCK
### Recommended next step
<action>
```

## Example prompts
```
/review-proposal 3
/review-proposal <base64-transaction>
```
