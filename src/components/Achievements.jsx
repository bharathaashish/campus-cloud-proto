import React from 'react'
import { useAppContext } from '../context/AppContext'

export default function Achievements() {
  const { user } = useAppContext()

  const achievements = [
    { name: 'Social Butterfly', likes: 100, description: `Get ${(100).toLocaleString()} likes` },
    { name: 'Influencer', likes: 1000, description: `Get ${(1000).toLocaleString()} likes` },
    { name: 'Icon', likes: 10000, description: `Get ${(10000).toLocaleString()} likes` },
    { name: 'Overlord', likes: 100000, description: `Get ${(100000).toLocaleString()} likes` },
  ]

  const unlockedAchievements = achievements.filter(a => (user?.totalLikes || 0) >= a.likes)
  const nextAchievement = achievements.find(a => (user?.totalLikes || 0) < a.likes)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-theme-primary">Achievements</h1>
      <div className="space-y-6">
        {achievements.map((achievement, index) => {
          const isUnlocked = (user?.totalLikes || 0) >= achievement.likes
          return (
            <div
              key={index}
              className={`p-6 rounded-lg border ${isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} flex justify-between items-center`}
            >
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${isUnlocked ? 'text-green-800' : 'text-gray-800'}`}>
                  {achievement.name}
                </h3>
                <p className={`text-sm ${isUnlocked ? 'text-green-600' : 'text-gray-600'}`}>
                  {achievement.description}
                </p>
              </div>
              <button
                className={`px-4 py-2 rounded-lg font-medium ${isUnlocked ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                disabled={!isUnlocked}
              >
                {isUnlocked ? 'Claim' : 'Locked'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
