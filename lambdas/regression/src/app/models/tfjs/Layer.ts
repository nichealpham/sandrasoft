export interface conv2dLayer {
    inputShape?: number[],
    kernelSize: number,
    filters: number,
    strides: number,
    activation: string,
    kernelInitializer: string
};

export interface denseLayer {
    inputShape?: number[],
    units: number,
    activation: string,
    kernelInitializer: string
};

export interface maxPooling2d {
    poolSize: number[],
    strides: number[],
};