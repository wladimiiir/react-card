import { getComponents } from '@/store.ts';

const TRANSFORM_OPTIONS = {
  presets: ['react'],
};

const COMPONENT_TEMPLATE = `
  (props) => {
    const {
      clsx,
      tw,
      useState,
      useEffect,
      useLayoutEffect,
      useRef,
      useMemo,
      useEntity,
      useEntityState,
      hass,
      showMoreInfo,
      @components@
      ...otherProps
    } = props;

    @content@;
  };
`;

const addReturnIfNotPresent = (content: string) => {
  if (!content.trim().startsWith('<')) {
    return content;
  }
  return `return (${content})`;
};

const injectTWToClassProperties = (content: string) => {
  const replaceSimpleClassPropertyByRegex = (content: string, regex: RegExp) => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const newValue = `tw(${match[2]}${match[3]}${match[2]})`;
      content = content.replace(match[0], `${match[1]}={${newValue}}`);
    }
    return content;
  };

  const replaceBracketedClassProperty = (content: string) => {
    const classNameRegex = /(className|class)\s*=\s*\{/g;

    let match;
    while ((match = classNameRegex.exec(content)) !== null) {
      const start = match.index + match[0].length;
      if (content.substring(start).startsWith('tw(')) {
        continue;
      }

      let end = -1;
      let bracketCount = 1;

      for (let i = start; i < content.length; i++) {
        const char = content[i];
        if (char === '{') {
          bracketCount++;
        } else if (char === '}') {
          bracketCount--;

          if (bracketCount === 0) {
            end = i;
            break;
          }
        }
      }
      if (end === -1) {
        continue;
      }

      const value = content.substring(start, end);
      content = content.substring(0, start) + `tw(${value})` + content.substring(end);
    }

    return content;
  };

  content = replaceBracketedClassProperty(content);
  content = replaceSimpleClassPropertyByRegex(content, /(className|class)\s*=\s*(")([^"]+)"/g);
  content = replaceSimpleClassPropertyByRegex(content, /(className|class)\s*=\s*(')([^']+)'/g);

  return content;
};

export const createDynamicComponent = (content: string) => {
  content = addReturnIfNotPresent(content);
  content = injectTWToClassProperties(content);

  const result = window.Babel.transform(
    COMPONENT_TEMPLATE.replace('@content@', content).replace(
      '@components@',
      Object.keys(getComponents().value)
        .map((key) => `${key},`)
        .join(''),
    ),
    TRANSFORM_OPTIONS,
  );
  const code = result.code.replace('props =>', 'return props =>');

  return Function(`"use strict";\n${code}`) as any;
};
