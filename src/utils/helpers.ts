export namespace Helpers {
    export function FillArray(arr: string[], length: number, element: any = ""): string[] {
        const count = length - arr.length;

        if (count > 0) {
            const result = [...arr];
            for (let i = 0; i < count; i++) {
                result.push(element);
            }

            return result;
        } else {
            return arr;
        }
    }
}
