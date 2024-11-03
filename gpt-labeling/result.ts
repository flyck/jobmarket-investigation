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
  console.log(`Labels: ${Object.keys(companySizes).map((val) => `"${val}"`)}`)
  console.log(`Data: ${Object.values(companySizes)}`)

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
    job.requiredLanguages?.forEach((language) => {
      if (skillStats[language]) {
        skillStats[language] += 1
      } else {
        skillStats[language] = 1
      }
    })
  })
  console.table(Object.entries(skillStats).sort((a, b) => b[1] - a[1]))
  const topSkills = Object.entries(skillStats).sort((a, b) => b[1] - a[1]).map(([key, value]) => { const tmp: any = {}; tmp[key] = value; return tmp })
  console.log(topSkills)
  console.log(`Labels: ${Object.keys(topSkills).map((val) => `"${val}"`)}`)
  console.log(`Data: ${Object.values(topSkills)}`)

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
  console.table(Object.entries(frameworkStats).sort((a, b) => b[1] - a[1]))
  console.log(`Labels: ${Object.keys(frameworkStats).map((val) => `"${val}"`)}`)
  console.log(`Data: ${Object.values(frameworkStats)}`)
}

main()
