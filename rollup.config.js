import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

let outputPath = `../altv-server/resources/southcentral/client`;

export default {
    input: './index.ts',
    output: {
        // dir: outputPath,
        format: 'esm'
    },
    plugins: [
        nodeResolve(),
        typescript()
    ]
}