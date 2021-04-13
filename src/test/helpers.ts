import { expect } from "chai";
import { AppError } from "../core/appError";

const asyncShouldThrow = async (fn: Function, desc) => {
  try {
    await fn();

    expect.fail(`Should have thrown an Error with desc ${desc}`);
  } catch (err) {
    expect(err).to.be.instanceOf(AppError);
    expect(err.description).to.be.equal(desc);
  }
};

export {
    asyncShouldThrow
}