import { result } from "./resultData"

function main() {
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

  console.log(`Total jobs: ${result.length}`)

  result.forEach((job) => {
    const size = job.companySize || "unknown"
    if (companySizes[size]) {
      companySizes[size] += 1
    } else {
      companySizes[size] = 1
    }
  })
  console.table(companySizes)
  console.log(JSON.stringify(companySizes).replace(/[\n\r]/g, ' '))

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
  console.log(JSON.stringify(consultingStats).replace(/[\n\r]/g, ' '))

  // get language stats
  const skillStats: { [key: string]: number } = {}
  result.forEach((job) => {
    job.requiredLanguages?.forEach((language) => {
      if (skillStats[language]) {
        skillStats[language] += 1
      } else {
        skillStats[language] = 1
      }
    })
  })
  const topSkills = Object.fromEntries(Object.entries(skillStats).sort((a, b) => b[1] - a[1]))
  console.table(topSkills)
  console.log(JSON.stringify(topSkills).replace(/[\n\r]/g, ' '))

  // get framework stats
  const frameworkStats: { [key: string]: number } = {}
  result.forEach((job) => {
    job.requiredFrameworks?.forEach((framework) => {
      if (frameworkStats[framework]) {
        frameworkStats[framework] += 1
      } else {
        frameworkStats[framework] = 1
      }
    })
  })
  const topFrameworks = Object.fromEntries(Object.entries(frameworkStats).sort((a, b) => b[1] - a[1]))
  console.table(topFrameworks)
  console.log(JSON.stringify(topFrameworks).replace(/[\n\r]/g, ' '))
}

main()
