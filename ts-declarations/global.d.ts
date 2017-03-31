interface ProcessProps {
    env: {
        NODE_ENV: string;
    };
}

declare const process: ProcessProps;
declare var module: { hot: any };