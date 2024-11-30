import React, { useEffect, useMemo, useState } from "react";
import jsonFile from "../data/new_drugs.json";
import condiFile from "../data/condi.json";

type DrugType = {
  Code: number;
  "Nom Commecial": string;
  "Nom DCI": string;
  Dosage: string;
  Conditionnement: string;
  Forme: string;
  Tarif: number;
  "Date Tarif": string;
};

type Result = DrugType & {
  condition: string;
};

type CondiType = {
  [key: string]: string;
};

const Main = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchType, setSearchType] = useState<keyof DrugType>("Nom DCI");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedDrug, setSelectedDrug] = useState<Result | null>(null);

  const handleChangeSearchType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchType(e.target.value as keyof DrugType);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  const proccedData = useMemo(() => {
    const numberToString = (num: number) => {
      let stringNumb = num.toString();
      const maxLength = 5;
      while (stringNumb.length < maxLength) {
        stringNumb = "0" + stringNumb;
      }
      return stringNumb;
    };
    const list = jsonFile["Feuil1"] as DrugType[];
    const conditionFile: CondiType = condiFile;
    return list.map((el: DrugType) => ({
      ...el,
      condition: conditionFile[numberToString(el.Code)],
    }));
  }, [jsonFile, condiFile]);

  const result = useMemo(() => {
    setSelectedIndex(0);
    setSelectedDrug(null);
    if (!debouncedQuery.trim()) {
      return [];
    }
    return proccedData.filter((el: Result) => {
      const value = el[searchType as keyof DrugType];
      if (typeof value === "string") {
        return value.toLowerCase().includes(debouncedQuery.toLowerCase());
      } else if (typeof value === "number") {
        return value
          .toString()
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase());
      }
      return false;
    });
  }, [debouncedQuery, proccedData, searchType]);

  useEffect(() => {
    if (result.length > 0) {
      setSelectedDrug(result[0]);
    }
  }, [result]);

  return (
    <main className="space-y-4 bg-[#f8fef3] px-4 py-3 pb-8">
      <div>
        <p className="font-semibold text-yellow-700">
          <span className="mr-2">Dernière mise à jour:</span>28 Nov 2024
        </p>
        <p className="font-semibold text-green-600">
          <span className="mr-2">Status:</span>à jour
        </p>
      </div>
      <div className="flex flex-col gap-4 md:max-w-screen-md">
        <input
          type="search"
          placeholder="Recherche"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded border px-4 py-2 shadow"
        />
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-x-2">
            <input
              type="radio"
              id="DN"
              value="Nom Commecial"
              name="searchType"
              checked={searchType === "Nom Commecial"}
              onChange={handleChangeSearchType}
            />
            <label htmlFor="DN">Nom commercial</label>
          </div>
          <div className="space-x-2">
            <input
              type="radio"
              id="DCI"
              value="Nom DCI"
              name="searchType"
              checked={searchType === "Nom DCI"}
              onChange={handleChangeSearchType}
            />
            <label htmlFor="DCI">DCI</label>
          </div>
        </div>
      </div>
      <p className="font-semibold text-yellow-700">
        Résultats: {result.length}
      </p>
      <div className="max-h-[600px] overflow-scroll">
        <table className="w-full table-auto border-collapse border border-slate-400 bg-slate-50">
          <caption className="mb-4 caption-top text-xl font-bold text-slate-400">
            Liste des médicaments remboursés en Algérie
          </caption>
          <thead className="bg-slate-200">
            <tr>
              <th className="border border-slate-300 p-2">Nom commercial</th>
              <th className="border border-slate-300 p-2">DCI</th>
              <th className="border border-slate-300 p-2">Dosage</th>
              <th className="border border-slate-300 p-2">Forme</th>
              <th className="border border-slate-300 p-2">Conditionnement</th>
            </tr>
          </thead>
          <tbody>
            {query.length > 0 && result.length > 0 ? (
              result.map((el: Result, index: number) => (
                <tr
                  key={index}
                  onClick={() => {
                    setSelectedIndex(index);
                    setSelectedDrug(el);
                  }}
                  className={
                    index === selectedIndex
                      ? "cursor-pointer bg-sky-500"
                      : "cursor-pointer"
                  }
                >
                  <td className="border border-slate-300 p-2">
                    {el["Nom Commecial"]}
                  </td>
                  <td className="border border-slate-300 p-2">
                    {el["Nom DCI"]}
                  </td>
                  <td className="border border-slate-300 p-2">
                    {el["Dosage"]}
                  </td>
                  <td className="border border-slate-300 p-2">{el["Forme"]}</td>
                  <td className="border border-slate-300 p-2">
                    {el["Conditionnement"]}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2">
                  Votre recherche n'a donné aucun résultat. Veuillez vérifier
                  que vous avez correctement saisi le nom du médicament
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <p className="my-2 font-bold">Conditions de remboursement:</p>
        <div className="rounded border p-2 font-semibold">
          {(result.length && selectedDrug?.condition) || "Aucun!"}
        </div>
      </div>
    </main>
  );
};
export default Main;
