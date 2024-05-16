module.exports = {
    presets: [
      '@babel/preset-env', // For modern JavaScript features
      '@babel/preset-react', // For JSX transformation
      '@babel/preset-typescript' // If you are using TypeScript
    ],
    plugins: [
        '@babel/plugin-syntax-jsx',
        '@babel/plugin-transform-runtime',
    ],
  };
  