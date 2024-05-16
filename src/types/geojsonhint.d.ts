// types/geojsonhint.d.ts
declare module '@mapbox/geojsonhint' {
    interface GeojsonHintError {
        message: string;
        line: number;
    }

    export function hint(geojson: any): GeojsonHintError[];
}
