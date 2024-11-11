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
  //"Go", // hard to label (intersects with Google Cloud & more)
  "Golang",
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
  "SAP",
];

const popularFrontendFrameworks = [
  "React",
  "Angular",
  "Vue",
  "Ember.js",
  "Backbone",
  "Meteor",
  "Svelte",
  "Preact",
  "Aurelia",
  "Polymer"
]

const consultingLabels = [
  "consulting",
  "beratung",
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
      let mentionedFrameworks: string[] = []

      popularLanguages.forEach((language) => {
        if (smallTitle.includes(language.toLowerCase())) {
          mentionedLanguages.push(language)
        } else if (smallDescription.includes(language.toLowerCase())) {
          mentionedLanguages.push(language)
        }
      })
      popularFrontendFrameworks.forEach((framework) => {
        if (smallTitle.includes(framework.toLowerCase())) {
          mentionedFrameworks.push(framework)
        } else if (smallDescription.includes(framework.toLowerCase())) {
          mentionedFrameworks.push(framework)
        }
      })

      consultingLabels.forEach((label) => {
        if (smallDescription.includes(label.toLowerCase())) {
          job["is_consulting"] = true
        }
      })
      if (!job["is_consulting"]) job["is_consulting"] = false
      job["languages"] = mentionedLanguages
      job["frameworks"] = mentionedFrameworks
      return job
    })
    .map((job) => (
      {
        title: job.title,
        company: job.company,
        companySize: job.company_num_employees,
        posted: job.date_posted,
        languages: job.languages,
        frameworks: job.frameworks,
        isConsulting: job.is_consulting,
        link: job.job_url
      })
    )

  console.table(result)

  // get company sizes
  const companySizes: { [key: string]: number } = {
    "2 to 10": 0,
    "1 to 50": 0,
    "11 to 50": 0,
    "51 to 200": 0,
    "201 to 500": 0,
    "501 to 1,000": 0,
    "1,001 to 5,000": 0,
    "5,001 to 10,000": 0,
    "10,000+": 0,
  }


  result.forEach((job) => {
    const size = job.companySize || "unknown"
    if (companySizes[size]) {
      companySizes[size] += 1
    } else {
      companySizes[size] = 1
    }
  })
  console.table(companySizes)
  console.log(inlineJson(companySizes))

  // get consulting jobs
  const consultingStats = {
    consulting: 0,
    regular: 0
  }
  result.forEach((result) => {
    if (result.isConsulting) {
      consultingStats.consulting += 1
    } else {
      consultingStats.regular += 1
    }
  })
  console.table(consultingStats)

  // get language stats
  const skillStats: { [key: string]: number } = {}
  result.forEach((job) => {
    job.languages?.forEach((language) => {
      if (skillStats[language]) {
        skillStats[language] += 1
      } else {
        skillStats[language] = 1
      }
    })
  })
  console.table(Object.entries(skillStats).sort((a, b) => b[1] - a[1]))
  console.log(inlineJson(skillStats))

  // get framework stats
  const frameworkStats: { [key: string]: number } = {}
  result.forEach((job) => {
    job.frameworks?.forEach((language) => {
      if (frameworkStats[language]) {
        frameworkStats[language] += 1
      } else {
        frameworkStats[language] = 1
      }
    })
  })

  console.table(Object.entries(frameworkStats).sort((a, b) => b[1] - a[1]))
  console.log(inlineJson(frameworkStats))
}

function inlineJson(input: object) {
  return JSON.stringify(input).replace(/[\n\r]/g, ' ')
}

await main()

interface JobListing {
  id: string;
  site: string;
  job_url: string;
  job_url_direct: string;
  languages?: string[];
  frameworks?: string[];
  is_consulting?: boolean;
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
