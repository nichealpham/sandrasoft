export interface MonicaConfig {
    epochs?: number;
    iterations?: number;
    shuffle?: boolean;
    optimizer?: string;
    normalize?: boolean;
    learningRate?: number;
    batchSize?: number;
    metrics?: string[];
}