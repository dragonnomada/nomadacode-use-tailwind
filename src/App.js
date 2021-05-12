/**
 * Nomada Code - useTailwind by Dragon Nomada
 * Created at 11 may 2021
 */

import { useEffect, useState } from "react";
import "./styles.css";

// IDEA: Crear botones distintos según el estado de la app

function Button({ color = "blue", children, ...buttonProps }) {
  return (
    <div className="p-2">
      <button
        className={`rounded bg-${color}-500 hover:bg-${color}-700 ring ring-${color}-300 focus:outline-none text-white px-2 py-1`}
        {...buttonProps}
      >
        {children || "Button"}
      </button>
    </div>
  );
}

function useTailwind(strings, ...parts) {
  const [style, setStyle] = useState("bg-blue-500");
  const [state, setState] = useState("default");

  useEffect(() => {
    let tailwind = "";

    for (let i = 0; i < strings.length; i++) {
      const string = strings[i];
      let part = parts[i];
      tailwind += `${string}${part || ""}`;
    }

    const fragments = {};

    tailwind.replace(/#([^{]+){([^}]*)}/g, (_, rawName, rawContent) => {
      const [name, ...extendedFragments] = rawName.trim().split(/\s+/);
      const content = rawContent
        .trim()
        .split(/[\s\r?\n]+/)

        .map((line) => line.trim());

      fragments[name] = {
        extendedFragments,
        content
      };
    });

    const definitions = {};

    tailwind.replace(/@([^{]+){([^}]*)}/g, (_, rawName, rawContent) => {
      const [name, ...extendedFragments] = rawName.trim().split(/\s+/);
      const content = rawContent
        .trim()
        .split(/[\s\r?\n]+/)

        .map((line) => line.trim());

      definitions[name] = {
        extendedFragments,
        content
      };
    });

    console.log(fragments);
    console.log(definitions);

    const definition = definitions[state];

    if (definition) {
      console.log(definition);
      const collectExtendedFragments = (source) => {
        console.log("source", source);
        const list = source.extendedFragments.reduce((list, fragmentName) => {
          const fragment = fragments[fragmentName.slice(1)];
          console.log(fragmentName, fragment);
          if (!fragment) return list;
          return [...list, ...collectExtendedFragments(fragment)];
        }, []);
        return [...new Set([...list, ...source.content])];
      };

      const content = collectExtendedFragments(definition);

      console.log(content);

      setStyle(content.join(" "));
    }
  }, [state]);

  return [
    style,
    (state) => {
      setState(state);
    }
  ];
}

export default function App() {
  const [buttonStyle, buttonState] = useTailwind`
    #base { 
      rounded 
      ring 
      focus:outline-none 
      px-2 py-1 
      text-white 
    }

    @default ~base {
      bg-purple-500
      hover:bg-purple-700
      ring-purple-300
    }

    @disabled ~base {
      bg-gray-400
      ring-gray-100
      cursor-not-allowed
    }

    @loading ~base {
      bg-blue-500
      hover:bg-blue-700
      ring-blue-300
    }
  `;

  return (
    <div className="p-8">
      <div className="p-2">
        <button className={buttonStyle}>My Button Styled</button>
      </div>
      <div className="py-4" />
      <hr className="py-4" />
      <Button color="gray" onClick={() => buttonState("disabled")}>
        Disabled
      </Button>
      <Button color="blue" onClick={() => buttonState("loading")}>
        Loading
      </Button>
      <Button color="purple" onClick={() => buttonState("default")}>
        Default
      </Button>
    </div>
  );
}
