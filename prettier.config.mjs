export default {
  printWidth: 160,
  trailingComma: "all",
  overrides: [
    {
      files: ["*.ts"],
      options: {
        parser: "typescript",
        plugins: ["prettier-plugin-organize-imports"],
      },
    },
  ],
};
