import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js", // Entry point
  output: {
    file: "dist/index.js",
    format: "cjs", // CommonJS for Node.js compatibility
  },
  plugins: [
    postcss({
      plugins: [],
      minimize: true,
    }),

    babel({
      exclude: "node_modules/**",
      presets: ["@babel/preset-react"],
    }),
    commonjs(),
    resolve({
      extensions: [".js", ".jsx"],
      customResolveOptions: {
        moduleDirectory: "src", // Specify the base directory
      },
    }),
    external(),
    terser(),
  ],
};
