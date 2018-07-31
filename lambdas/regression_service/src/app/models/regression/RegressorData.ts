export interface RegressorData {
    weights: Float32Array | Int32Array | Uint8Array;
    bias: number;
    nFeatures: number;
};