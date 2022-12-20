import React from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import Admonition from "@theme/Admonition";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

function Table({ columns = [], body = [] }) {
  return (
    <table className={styles.rulesTable}>
      <thead>
        <tr>
          {columns.map((name, i) => {
            return (
              <th className={i === 0 ? styles.ruleCol : styles.attrCol}>
                {name}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {body.map((bodyObject) => {
          return (
            <tr>
              {bodyObject.map((bodyObjectAttr) => {
                return <td className={styles.attrCol}>{bodyObjectAttr}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function RulesTable(props) {
  const { rules, categories, linkPath } = usePluginData(
    "docusaurus-plugin-eslint-rules"
  );

  const STAR = "✔";
  const PEN = "🔧";

  const deprecatedRules = rules.filter((entry) => entry[1]?.meta?.deprecated);

  const recommendedRules = rules.reduce((obj, entry) => {
    const name = `${entry[0]}`;
    const meta = entry[1]?.meta;

    const recommended = meta?.docs?.recommended;
    if (recommended) {
      obj[name] = {
        fixable: meta?.fixable,
        hasSuggestions: meta?.hasSuggestions,
      };
    }
    return obj;
  }, {});

  return (
    <div>
      {Object.keys(recommendedRules || {})?.length > 0 ? (
        <>
          <h1>Recommended</h1>
          <Admonition type="info">These are the recommended rules.</Admonition>
          <Table
            columns={["Rule ID", "Fixable", "Has Suggestions"]}
            body={Object.keys(recommendedRules).map((name) => {
              const { fixable, hasSuggestions } = recommendedRules[name];

              return [name, fixable ? "✅" : "", hasSuggestions ? "✅" : ""];
            })}
          />
        </>
      ) : null}

      {categories.map((category) => {
        return (
          <>
            <h2>{category}</h2>
            <Table
              columns={["", "Rule ID", "Description"]}
              body={rules
                .filter(
                  ([, rule]) =>
                    rule?.meta?.docs.category === category &&
                    !rule?.meta?.deprecated
                )
                .map((entry) => {
                  const name = entry[0];
                  const meta = entry[1].meta;
                  const mark = `${meta?.docs.recommended ? STAR : ""}${
                    meta.fixable ? PEN : ""
                  }`;

                  const description =
                    meta?.docs.description || "(no description)";

                  return [
                    mark,
                    linkPath ? (
                      <Link to={`${linkPath}/${name}`}>{name}</Link>
                    ) : (
                      { name }
                    ),
                    description,
                  ];
                })}
            />
          </>
        );
      })}
      {deprecatedRules.length > 0 ? (
        <>
          <h2>Deprecated</h2>
          <Admonition type="warning">
            We're going to remove deprecated rules in the next major release.
            Please migrate to successor/new rules.
          </Admonition>

          <Table
            columns={["Rule ID", "Description"]}
            body={deprecatedRules.map((entry) => {
              const name = entry[0];
              const meta = entry[1].meta;
              const link = linkPath ? (
                <Link to={`${linkPath}${name}`}>{name}</Link>
              ) : (
                name
              );
              const replacedBy =
                (meta.docs.replacedBy || [])
                  .map((id) =>
                    linkPath ? <Link to={`${linkPath}${id}`}>{id}</Link> : id
                  )
                  .join(", ") || "(no replacement)";

              return [link, replacedBy];
            })}
          />
        </>
      ) : null}
    </div>
  );
}
