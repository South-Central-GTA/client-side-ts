import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
    input: './index.ts',
    output: {
        dir: '../../altv-server/resources/southcentral/client',
        format: 'esm'
    },
    plugins: [
        nodeResolve(),
        typescript()
    ]
}