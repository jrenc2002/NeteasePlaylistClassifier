import { type FC } from 'react'

interface SocialLink {
  platform: string
  username: string
  url: string
  icon: string
}

interface GitHubProject {
  name: string
  description: string
  url: string
  stars?: number
}

const SettingView: FC = () => {
  const socialLinks: SocialLink[] = [
    {
      platform: 'Bilibili',
      username: 'Jrenc',
      url: 'https://space.bilibili.com/32090268',
      icon: 'https://i0.hdslb.com/bfs/face/2790c2368f6e9fc3edde5a3e8c810694dddfedc7.jpg'
    },
    {
      platform: 'Twitter',
      username: 'jrenc2002',
      url: 'https://twitter.com/jrenc2002',
      icon: '/icons/twitter.svg'
    },
    {
      platform: 'GitHub',
      username: 'jrenc2002',
      url: 'https://github.com/jrenc2002',
      icon: '/icons/github.svg'
    },
    // 个人官网
    {
        platform: '个人主页',
        username: 'jrenc',
        url: 'https://jrenc.com',
        icon: '/icons/github.svg'
      },
  ]

  const githubProjects: GitHubProject[] = [
    {
      name: 'NeteasePlaylistClassifier',
      description: '网易云歌单分类器',
      url: 'https://github.com/jrenc2002/NeteasePlaylistClassifier',
      stars: 999
    }
    // 可以添加更多项目
  ]

  return (
    <div className="flex max-h-screen flex-col pt-6 md:pt-8">
      <div className="container mx-auto px-4 max-w-screen-sm md:max-w-none grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        {/* 社交媒体账号卡片 */}
        <div className="flex flex-col h-auto md:h-[calc(100vh-8rem)] w-full">
          <div className="bg-white rounded-lg border border-gray-300 p-4 md:p-6 shadow-lg mb-4 md:mb-6 w-full">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">社交媒体账号</h2>
            <div className="space-y-3 md:space-y-4">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 md:p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="ml-3 md:ml-4">
                    <h3 className="font-medium text-gray-900 text-sm md:text-base">{link.platform}</h3>
                    <p className="text-xs md:text-sm text-gray-500">{link.username}</p>
                  </div>
                  <div className="ml-auto">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* GitHub项目卡片 */}
        <div className="flex flex-col h-auto md:h-[calc(100vh-8rem)] w-full">
          <div className="bg-white rounded-lg border border-gray-300 p-4 md:p-6 shadow-lg mb-4 md:mb-6 w-full">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">GitHub 项目</h2>
            <div className="space-y-3 md:space-y-4">
              {githubProjects.map((project) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 md:p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-orange-500 text-sm md:text-base">{project.name}</h3>
                    <div className="flex items-center text-gray-500 text-xs md:text-sm">
                      {"点个Star吧，宝QAQ"}
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">{project.description}</p>
                </a>
              ))}
            </div>
          </div>

          {/* 使用教程卡片 */}
          <div className="bg-white rounded-lg border border-gray-300 p-4 md:p-6 shadow-lg w-full">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">使用教程</h2>
            <div className="space-y-3 md:space-y-4">
              <a
                href="https://space.bilibili.com/32090268"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col p-4 md:p-6 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <div className="flex items-center mb-3 md:mb-4">
                  <span className="font-medium text-gray-900 text-sm md:text-base">Bilibili 视频教程</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  详细的使用教程和演示视频在B站上哦！欢迎点击获取教程🌸
                </p>
                <div className="mt-3 md:mt-4 flex items-center text-blue-500 text-xs md:text-sm">
                  <span>立即观看</span>
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingView