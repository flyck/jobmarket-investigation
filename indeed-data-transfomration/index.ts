import dayjs from "dayjs"
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekOfYear);

async function main(sector: string) {
  const data = await Bun.file("data.json").json() as HiringLabSectoralPosting[]

  const monthlyData: { [key: string]: number[] } = {}

  data
    .filter((entry) => entry.sectorName === sector)
    .forEach((entry) => {
      const date = dayjs(entry.dateString)

      const key = `${date.year()}-${date.month()}`
      if (!monthlyData[key]) {
        monthlyData[key] = [entry.value]
      } else {
        monthlyData[key] = [...monthlyData[key], entry.value]
      }
    })

  const weeklyAverage: { [key: string]: number } = {}

  Object.entries(monthlyData).forEach(([key, numbers]) => {
    const sum = numbers.reduce((acc, current) => acc + current, 0);
    weeklyAverage[key] = parseInt((sum / numbers.length) + "")
  })
  console.log(JSON.stringify(weeklyAverage).replace(/[\n\r]/g, ' '))
}

await main("Software Development")
await main("Human Resources")

interface HiringLabSectoralPosting {
  __typename: string;
  dateString: string;
  countryCode: string;
  countryName: string;
  sectorCode: string;
  sectorName: string;
  value: number;
}
