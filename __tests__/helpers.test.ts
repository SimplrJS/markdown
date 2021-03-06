import { Helpers } from "../src/utils/helpers";

describe("FillArray", () => {
    it("fills an array with empty string", () => {
        const arr = [];
        const result = Helpers.FillArray(arr, 10, "");
        expect(result).toMatchSnapshot();
    });

    it("fills an array with zeroes", () => {
        const arr: number[] = [];
        const result = Helpers.FillArray(arr, 10, 0);
        expect(result).toMatchSnapshot();
    });

    it("returns the same array if the size is sufficient", () => {
        const arr = ["", "", ""];
        const result = Helpers.FillArray(arr, 3, "");
        expect(result).toBe(arr);
    });
});
