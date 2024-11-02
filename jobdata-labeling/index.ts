import { parse } from "csv-parse/sync";

const popularLanguages = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  //"C", // hard to label
  "PHP",
  "Ruby",
  "Swift",
  "Go",
  "Kotlin",
  "Rust",
  "TypeScript",
  "Visual Basic .NET",
  "Perl",
  "SQL",
  "MATLAB",
  "Julia",
  "Haskell",
  "Scala",
  "Groovy",
  "F#",
  "Lua",
  "Tcl",
  "Prolog",
  "Assembly",
  "Fortran",
  "Pascal",
];

const popularFrontendFrameworks = [
  "React",
  "Angular",
  "Vue",
  "Ember",
  "Backbone",
  "Meteor",
  "Svelte",
  "Preact",
  "Aurelia",
  "Polymer"
]

async function main() {
  const csvData = await Bun.file("jobs.csv").text();

  const parsedData = await parse(csvData, {
    columns: true,
    autoParse: true,
  }) as JobListing[]

  const result = parsedData
    .filter((job) => new Date(job.date_posted) > new Date("2024-01-01"))
    .filter((job) => job.site === "indeed")
    .map((job) => {
      const smallDescription = job.description.toLowerCase()
      const smallTitle = job.title.toLowerCase()
      let mentionedLanguages: string[] = []

      popularLanguages.forEach((language) => {
        if (smallTitle.includes(language.toLowerCase())) {
          mentionedLanguages.push(language)
        } else if (smallDescription.includes(language.toLowerCase())) {
          mentionedLanguages.push(language)
        }
      })
      popularFrontendFrameworks.forEach((framework) => {
        if (smallTitle.includes(framework.toLowerCase())) {
          mentionedLanguages.push(framework)
        } else if (smallDescription.includes(framework.toLowerCase())) {
          mentionedLanguages.push(framework)
        }
      })
      job["languages"] = mentionedLanguages
      return job
    })
    .map((job) => (
      { title: job.title, company: job.company, companySize: job.company_num_employees, posted: job.date_posted, languages: job.languages })
    )

  console.table(result)
}

await main()

interface JobListing {
  id: string;
  site: string;
  job_url: string;
  job_url_direct: string;
  languages?: string[];
  title: string;
  company: string;
  location: string;
  date_posted: string;
  job_type: string;
  salary_source: string;
  interval: string;
  min_amount: string;
  max_amount: string;
  currency: string;
  is_remote: string;
  job_level: string;
  job_function: string;
  listing_type: string;
  emails: string;
  description: string;
  company_industry: string;
  company_url: string;
  company_logo: string;
  company_url_direct: string;
  company_addresses: string;
  company_num_employees: string;
  company_revenue: string;
  company_description: string;
}
