'use client'

import { useState, useEffect, } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Building, Wifi } from 'lucide-react'

export default function Game() {
  const [population, setPopulation] = useState(1000)
  const [satisfaction, setSatisfaction] = useState(80)
  const [money, setMoney] = useState(20000)
  const [days, setDays] = useState(1)
  const [coverage, setCoverage] = useState(0)
  const [towers, setTowers] = useState(0)
  const [residential, setResidential] = useState(0)
  const [commercial, setCommercial] = useState(0)
  const [industrial, setIndustrial] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setDays(prev => prev + 1)
      updateResources()
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const updateResources = () => {
    const income = (residential * 100) + (commercial * 200) + (industrial * 300)
    setMoney(prev => prev + income)
    
    const popGrowth = Math.floor((residential * 50) * (coverage / 100))
    setPopulation(prev => prev + popGrowth)
    
    const newSatisfaction = Math.min(100, Math.max(0, 
      satisfaction + (coverage > 80 ? 1 : -1)))
    setSatisfaction(newSatisfaction)
  }

  const buildTower = () => {
    if (money >= 4000) {
      setMoney(prev => prev - 4000)
      setTowers(prev => prev + 1)
      setCoverage(prev => Math.min(100, prev + 10))
    }
  }

  const buildResidential = () => {
    if (money >= 2000) {
      setMoney(prev => prev - 2000)
      setResidential(prev => prev + 1)
    }
  }

  const buildCommercial = () => {
    if (money >= 2000) {
      setMoney(prev => prev - 2000)
      setCommercial(prev => prev + 1)
    }
  }

  const buildIndustrial = () => {
    if (money >= 2000) {
      setMoney(prev => prev - 2000)
      setIndustrial(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">联通智慧城市</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-lg">人口: {population.toLocaleString()}</div>
            <div className="text-lg">满意度: {satisfaction.toFixed(1)}%</div>
            <Progress value={satisfaction} className="h-2" />
            <div className="text-lg">资金: ¥{money.toLocaleString()}</div>
            <div className="text-lg">天数: {days}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Button 
              onClick={buildResidential}
              disabled={money < 2000}
              className="w-full"
              variant="outline"
            >
              <Building className="mr-2 h-4 w-4" />
              住宅 (¥2000)
            </Button>
            <Button
              onClick={buildCommercial}
              disabled={money < 2000}
              className="w-full"
              variant="outline"
            >
              <Building className="mr-2 h-4 w-4" />
              商业 (¥2000)
            </Button>
            <Button
              onClick={buildIndustrial}
              disabled={money < 2000}
              className="w-full"
              variant="outline"
            >
              <Building className="mr-2 h-4 w-4" />
              工业 (¥2000)
            </Button>
            <Button
              onClick={buildTower}
              disabled={money < 4000}
              className="w-full"
              variant="outline"
            >
              <Wifi className="mr-2 h-4 w-4" />
              信号塔 (¥4000)
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-lg">网络覆盖率{coverage.toFixed(1)}%</div>
            <Progress value={coverage} className="h-2" />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">成就:</h3>
            <div className="space-y-1">
              {population >= 5000 && <div>🏆 人口达到5000</div>}
              {satisfaction >= 90 && <div>🌟 满意度达到90%</div>}
              {coverage >= 100 && <div>📡 全城网络覆盖</div>}
              {money >= 100000 && <div>💰 资金达到100,000</div>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}