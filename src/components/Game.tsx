'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Wifi, Building, AlertTriangle } from 'lucide-react'

type Building = {
  type: 'residential' | 'commercial' | 'industrial'
  level: number
  x: number
  y: number
}

type Tower = {
  level: number
  x: number
  y: number
}

type Event = {
  type: 'network_outage' | 'population_boom' | 'economic_crisis'
  duration: number
}

export default function Game() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [towers, setTowers] = useState<Tower[]>([])
  const [population, setPopulation] = useState(1000)
  const [satisfaction, setSatisfaction] = useState(80)
  const [money, setMoney] = useState(20000)
  const [day, setDay] = useState(1)
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])
  const gameAreaRef = useRef<HTMLDivElement>(null)

  const addBuilding = (type: Building['type']) => {
    if (money < 2000) return
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect()
      const newBuilding: Building = {
        type,
        level: 1,
        x: Math.random() * (rect.width - 24),
        y: Math.random() * (rect.height - 24)
      }
      setBuildings([...buildings, newBuilding])
      setMoney(money - 2000)
    }
  }

  const addTower = () => {
    if (money < 4000) return
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect()
      const newTower: Tower = {
        level: 1,
        x: Math.random() * (rect.width - 32),
        y: Math.random() * (rect.height - 32)
      }
      setTowers([...towers, newTower])
      setMoney(money - 4000)
    }
  }

  const upgradeTower = (index: number) => {
    if (money < 3000) return
    const updatedTowers = [...towers]
    updatedTowers[index].level += 1
    setTowers(updatedTowers)
    setMoney(money - 3000)
  }

  const upgradeBuilding = (index: number) => {
    const building = buildings[index];
    const upgradeCost = 2000 * building.level;
    if (money < upgradeCost) return;
    const updatedBuildings = [...buildings];
    updatedBuildings[index] = { ...building, level: building.level + 1 };
    setBuildings(updatedBuildings);
    setMoney(money - upgradeCost);
  }

  const calculateNetworkCoverage = () => {
    const totalBuildings = buildings.length
    const coveredBuildings = buildings.filter(building =>
      towers.some(tower =>
        Math.sqrt(Math.pow(tower.x - building.x, 2) + Math.pow(tower.y - building.y, 2)) < 60 * tower.level
      )
    ).length
    return totalBuildings > 0 ? (coveredBuildings / totalBuildings) * 100 : 0
  }

  const triggerRandomEvent = () => {
    const events: Event[] = [
      { type: 'network_outage', duration: 3 },
      { type: 'population_boom', duration: 5 },
      { type: 'economic_crisis', duration: 4 }
    ]
    setCurrentEvent(events[Math.floor(Math.random() * events.length)])
  }

  useEffect(() => {
    if (gameOver) return

    const gameLoop = setInterval(() => {
      const growth = Math.floor(population * 0.01 * (satisfaction / 100))
      setPopulation(prev => prev + growth)

      const income = buildings.reduce((sum, building) => {
        const baseIncome = building.type === 'residential' ? 80 : building.type === 'commercial' ? 160 : 240
        return sum + baseIncome * building.level
      }, 0)
      const maintenance = buildings.length * 100 + towers.length * 200
      setMoney(prev => prev + income - maintenance)

      const coverage = calculateNetworkCoverage()
      setSatisfaction(prev => Math.max(0, Math.min(100, prev + (coverage - 70) / 10)))

      if (currentEvent) {
        if (currentEvent.type === 'network_outage') {
          setSatisfaction(prev => Math.max(0, prev - 5))
          setMoney(prev => Math.floor(prev * 0.95))
        } else if (currentEvent.type === 'population_boom') {
          setPopulation(prev => Math.floor(prev * 1.1))
          setSatisfaction(prev => Math.max(0, prev - 3))
        } else if (currentEvent.type === 'economic_crisis') {
          setMoney(prev => Math.floor(prev * 0.85))
          setPopulation(prev => Math.floor(prev * 0.95))
        }
        setCurrentEvent(prev => prev ? {...prev, duration: prev.duration - 1} : null)
      } else if (Math.random() < 0.05) {
        triggerRandomEvent()
      }

      setDay(prev => prev + 1)

      if (satisfaction <= 0 || population <= 0) {
        setGameOver(true)
      }

      if (population >= 10000 && !achievements.includes('人口大城市')) {
        setAchievements(prev => [...prev, '人口大城市'])
      }
      if (satisfaction >= 90 && !achievements.includes('满意度之星')) {
        setAchievements(prev => [...prev, '满意度之星'])
      }
      if (buildings.length >= 20 && !achievements.includes('建筑大师')) {
        setAchievements(prev => [...prev, '建筑大师'])
      }
      if (towers.length >= 10 && !achievements.includes('网络覆盖专家')) {
        setAchievements(prev => [...prev, '网络覆盖专家'])
      }
    }, 1000)

    return () => clearInterval(gameLoop)
  }, [buildings, towers, population, satisfaction, money, currentEvent, gameOver, achievements])

  const restartGame = () => {
    setBuildings([])
    setTowers([])
    setPopulation(1000)
    setSatisfaction(80)
    setMoney(20000)
    setDay(1)
    setCurrentEvent(null)
    setGameOver(false)
    setAchievements([])
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">联通智慧城市</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>人口: {population.toLocaleString()}</div>
          <div>满意度: {satisfaction.toFixed(1)}%</div>
          <div>资金: ¥{money.toLocaleString()}</div>
          <div>天数: {day}</div>
        </div>
        <div 
          ref={gameAreaRef}
          className="relative w-full aspect-[20/9] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300"
        >
          {buildings.map((building, index) => (
            <div key={`building-${index}`} className="absolute" style={{ left: building.x, top: building.y }}>
              <Building
                className={`w-6 h-6 ${
                  building.type === 'residential' ? 'text-green-500' :
                  building.type === 'commercial' ? 'text-blue-500' : 'text-yellow-500'
                }`}
              />
              <button
                onClick={() => upgradeBuilding(index)}
                className="absolute top-full left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-1 rounded"
              >
                升级 (¥{2000 * building.level})
              </button>
            </div>
          ))}
          {towers.map((tower, index) => (
            <div key={`tower-${index}`} className="absolute" style={{ left: tower.x, top: tower.y }}>
              <Wifi
                className="w-8 h-8 text-red-500 cursor-pointer"
                onClick={() => upgradeTower(index)}
              />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-1 rounded">
                Lv.{tower.level}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => addBuilding('residential')} disabled={money < 2000}>
            <Building className="w-4 h-4 mr-2" />
            住宅 (¥2000)
          </Button>
          <Button onClick={() => addBuilding('commercial')} disabled={money < 2000}>
            <Building className="w-4 h-4 mr-2" />
            商业 (¥2000)
          </Button>
          <Button onClick={() => addBuilding('industrial')} disabled={money < 2000}>
            <Building className="w-4 h-4 mr-2" />
            工业 (¥2000)
          </Button>
          <Button onClick={addTower} disabled={money < 4000}>
            <Wifi className="w-4 h-4 mr-2" />
            信号塔 (¥4000)
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">网络覆盖率</span>
            <span className="text-sm">{calculateNetworkCoverage().toFixed(1)}%</span>
          </div>
          <Progress value={calculateNetworkCoverage()} />
        </div>
        {currentEvent && (
          <div className="bg-yellow-100 p-2 rounded-md flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
            <span className="text-sm">
              {currentEvent.type === 'network_outage' && '网络故障！满意度下降中'}
              {currentEvent.type === 'population_boom' && '人口激增！'}
              {currentEvent.type === 'economic_crisis' && '经济危机！资金减少中'}
              （还剩 {currentEvent.duration} 天）
            </span>
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">成就：</h3>
          <ul className="list-disc list-inside">
            {achievements.map((achievement, index) => (
              <li key={index} className="text-sm">{achievement}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-64">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">游戏结束</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p>您的城市发展了 {day} 天</p>
              <p>最终人口: {population.toLocaleString()}</p>
              <p>最终满意度: {satisfaction.toFixed(1)}%</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Button onClick={restartGame}>再玩一次</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Card>
  )
}