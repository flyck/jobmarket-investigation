import OpenAI from "openai";
import { parse } from "csv-parse/sync";
import type { JobListing } from "./types";

const openai = new OpenAI();


async function gptLabel(job: { jobUrl: string, title: string, description: string, companySize?: string }) {
  const { jobUrl, title, description, companySize } = job
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: `user`, content: `jobUrl: ${jobUrl}, companySize: ${companySize}, Title: ${title}, Description: ${description.replaceAll("\n", ` `)}` },
      { role: "user", content: "For the following job description, please give me the following data in the form of a json object {jobUrl: string, requiredLanguages: string[], requiredFrameworks: string[], isConsulting: boolean, companySize: string}. requiredLanguages should be a subset of: JavaScript,Python,Java,C++,C#,C,PHP,Ruby,Swift,Go,Golang,Kotlin,Rust,TypeScript,Visual Basic .NET,Perl,SQL,MATLAB,Julia,Haskell,Scala,Groovy,F#,Lua,Tcl,Prolog,Assembly,Fortran,Pascal,SAP. requiredFrameworks should be a subset of: React,Angular,Vue,Ember.js,Backbone,Meteor,Svelte,Preact,Aurelia,Polymer. If one of the fields cannot be filled please leave it empty. You can copy the jobUrl and the companysize from the original if they are provided. Dont surround the response with a code block. Add a comma at the end of the response, so I can insert this json response into an array." }
    ],
    stream: true,
  });
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

async function main() {
  const csvData = await Bun.file("jobs.csv").text();

  const parsedRawData = await parse(csvData, {
    columns: true,
    autoParse: true,
  }) as JobListing[]

  const filteredRawData = parsedRawData
    .filter((job) => new Date(job.date_posted) > new Date("2024-01-01"))
    .filter((job) => job.site === "indeed")

  for (let i = 0; i < filteredRawData.length; i++) {
    const job = filteredRawData[i]
    await gptLabel({ jobUrl: job.job_url, title: job.title, description: job.description, companySize: job.company_num_employees })
  }

  console.log("\ndone :)")
}

await main()
