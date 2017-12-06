export namespace Helpers {
    export function FillArray<TElement>(arr: TElement[], length: number, element: TElement): TElement[] {
        const count = length - arr.length;

        if (count > 0) {
            const result: TElement[] = [...arr];
            for (let i = 0; i < count; i++) {
                result.push(element);
            }

            return result;
        } else {
            return arr;
        }
    }
}
