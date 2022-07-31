const skillDescriptionFormat = (
  description: string,
  variables: { [key: string]: string[] },
  level: number
) => {
  return Object.entries(variables).reduce(
    (prev, current) =>
      prev.replace(`\${${current[0]}}`, `**${current[1][level - 1]}**`),
    description
  );
};

export default skillDescriptionFormat;
