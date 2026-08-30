import assert from "node:assert/strict";
import test from "node:test";
import { lineTotal, parseWeightInput } from "./quantity.ts";

test("300 g de tomate a $1000 el kg valen $300", () => {
  assert.equal(lineTotal(1000, 0.3), 300);
  assert.equal(parseWeightInput("300"), 0.3);
  assert.equal(parseWeightInput("300g"), 0.3);
});

test("entiende 200g, 0,5 kg y 1kg", () => {
  assert.equal(parseWeightInput("200"), 0.2);
  assert.equal(parseWeightInput("200g"), 0.2);
  assert.equal(parseWeightInput("200 gr"), 0.2);
  assert.equal(parseWeightInput("0,5"), 0.5);
  assert.equal(parseWeightInput("0.5 kg"), 0.5);
  assert.equal(parseWeightInput("1kg"), 1);
  assert.equal(parseWeightInput("1,5"), 1.5);
});
