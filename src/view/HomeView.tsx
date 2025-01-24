import { type FC, useMemo, useEffect } from 'react'
import axios from 'axios'
import { useAtom } from 'jotai'
import {
  type MusicInfo,
  type FilterOptions,
  playlistIdAtom,
  songsAtom,
  loadingAtom,
  errorAtom,
  analyzingAtom,
  musicInfosAtom,
  progressAtom,
  filterOptionsAtom,
  bpmDisplayValuesAtom
} from '@/store/HomeState'

const apiUrl = 'https://wyy.jrenc.com'

const HomeView: FC = () => {
  // 使用全局状态替换本地状态
  const [playlistId, setPlaylistId] = useAtom(playlistIdAtom)
  const [songs, setSongs] = useAtom(songsAtom)
  const [loading, setLoading] = useAtom(loadingAtom)
  const [error, setError] = useAtom(errorAtom)
  const [analyzing, setAnalyzing] = useAtom(analyzingAtom)
  const [musicInfos, setMusicInfos] = useAtom(musicInfosAtom)
  const [progress, setProgress] = useAtom(progressAtom)
  const [filterOptions, setFilterOptions] = useAtom(filterOptionsAtom)
  const [bpmDisplayValues, setBpmDisplayValues] = useAtom(bpmDisplayValuesAtom)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 尝试解析网易云音乐歌单链接
    if (value.includes('music.163.com/playlist')) {
      try {
        const url = new URL(value)
        const id = url.searchParams.get('id')
        if (id) {
          setPlaylistId(id)
          return
        }
      } catch (err) {
        // URL 解析失败，使用原始输入
      }
    }
    setPlaylistId(value)
  }

  const handleFetchPlaylist = async () => {
    if (!playlistId.trim()) {
      setError('请输入歌单ID')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await axios.get(`${apiUrl}/playlist/track/all?id=${playlistId}`)
      if (response.data.code === 200) {
        setSongs(response.data.songs)
        setMusicInfos([]) // 清空之前的分析结果
        setProgress({ current: 0, total: 0, currentSong: '' }) // 重置进度
      }
    } catch (err) {
      setError('获取歌单失败，请检查ID是否正确')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (songs.length === 0) {
      setError('请先获取歌单')
      return
    }

    setAnalyzing(true)
    setProgress({ current: 0, total: songs.length, currentSong: '' })
    const newMusicInfos: MusicInfo[] = []

    try {
      for (let i = 0; i < songs.length; i++) {
        const song = songs[i]
        setProgress({
          current: i + 1,
          total: songs.length,
          currentSong: song.name
        })

        try {
          const response = await axios.get(`${apiUrl}/song/wiki/summary?id=${song.id}`)
          if (response.data.code === 200) {
            const basicBlock = response.data.data.blocks.find(
              (block: any) => block.code === 'SONG_PLAY_ABOUT_SONG_BASIC'
            )
            
            if (basicBlock && basicBlock.creatives) {
              const musicInfo: MusicInfo = {
                songId: song.id,
                songName: song.name,
                style: [],
                tags: [],
                language: '',
                bpm: undefined
              }

              basicBlock.creatives.forEach((creative: any) => {
                if (creative.creativeType === 'songTag') {
                  musicInfo.style = creative.resources.map((res: any) => 
                    res.uiElement.mainTitle.title
                  )
                }
                else if (creative.creativeType === 'songBizTag') {
                  musicInfo.tags = creative.resources.map((res: any) => 
                    res.uiElement.mainTitle.title
                  )
                }
                else if (creative.creativeType === 'language') {
                  musicInfo.language = creative.uiElement.textLinks?.[0]?.text || ''
                }
                else if (creative.creativeType === 'bpm') {
                  const bpmText = creative.uiElement.textLinks?.[0]?.text
                  if (bpmText) {
                    musicInfo.bpm = parseInt(bpmText)
                  }
                }
              })

              newMusicInfos.push(musicInfo)
              setMusicInfos([...newMusicInfos])
            }
          }
        } catch (err) {
          console.error(`获取歌曲 ${song.id} 的信息失败`)
        }
      }
    } finally {
      setAnalyzing(false)
      setProgress({ current: 0, total: 0, currentSong: '' })
    }
  }

  const renderProgressBar = () => {
    if (!analyzing || progress.total === 0) return null

    const percentage = (progress.current / progress.total) * 100
    return (
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>正在分析: {progress.currentSong}</span>
          <span>{progress.current} / {progress.total}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          已完成 {percentage.toFixed(1)}%
        </p>
      </div>
    )
  }

  // 提取所有可用的筛选选项
  const availableFilters = useMemo(() => {
    const filters = {
      styles: new Set<string>(),
      tags: new Set<string>(),
      languages: new Set<string>(),
      bpmRange: {
        min: Infinity,
        max: -Infinity
      }
    }

    musicInfos.forEach(info => {
      // 收集曲风
      info.style?.forEach(style => filters.styles.add(style))
      // 收集标签
      info.tags?.forEach(tag => filters.tags.add(tag))
      // 收集语种
      if (info.language) {
        filters.languages.add(info.language)
      }
      // 收集BPM范围
      if (info.bpm) {
        filters.bpmRange.min = Math.min(filters.bpmRange.min, info.bpm)
        filters.bpmRange.max = Math.max(filters.bpmRange.max, info.bpm)
      }
    })

    // 对曲风进行中文字符排序
    const sortedStyles = Array.from(filters.styles).sort((a, b) => {
      return a.localeCompare(b, 'zh-CN')
    })

    return {
      styles: sortedStyles,
      tags: Array.from(filters.tags),
      languages: Array.from(filters.languages),
      bpmRange: filters.bpmRange.min !== Infinity ? filters.bpmRange : null
    }
  }, [musicInfos])
  // 在组件初始化和bpmRange改变时更新显示值
  useEffect(() => {
    if (availableFilters.bpmRange) {
      setBpmDisplayValues({
        min: filterOptions.bpmRange?.min ?? availableFilters.bpmRange.min,
        max: filterOptions.bpmRange?.max ?? availableFilters.bpmRange.max
      })
    }
  }, [availableFilters.bpmRange, filterOptions.bpmRange])
  // 筛选后的音乐列表
  const filteredMusicInfos = useMemo(() => {
    return musicInfos.filter((info: MusicInfo) => {
      // 筛选曲风
      if (filterOptions.styles.length > 0 && 
          !info.style?.some(style => filterOptions.styles.includes(style))) {
        return false
      }
      // 筛选标签
      if (filterOptions.tags.length > 0 && 
          !info.tags?.some(tag => filterOptions.tags.includes(tag))) {
        return false
      }
      // 筛选语种
      if (filterOptions.languages.length > 0 && 
          !filterOptions.languages.includes(info.language || '')) {
        return false
      }
      // 筛选BPM
      if (filterOptions.bpmRange && info.bpm) {
        if (info.bpm < filterOptions.bpmRange.min || 
            info.bpm > filterOptions.bpmRange.max) {
          return false
        }
      }
      return true
    })
  }, [musicInfos, filterOptions])

  const handleFilterChange = (type: keyof FilterOptions, value: any) => {
    setFilterOptions(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const handleCopyFilteredSongs = () => {
    const songList = filteredMusicInfos.map(info => {
      const song = songs.find(s => s.id === info.songId)
      return `${info.songName} - ${song?.ar.map(artist => artist.name).join(' / ')}`
    }).join('\n')
    
    navigator.clipboard.writeText(songList)
      .then(() => {
        console.log('复制成功')
      })
      .catch(err => {
        console.error('复制失败:', err)
      })
  }


  return (
    <div className="flex max-h-screen flex-col pt-6 md:pt-8">
      <div className="container mx-auto px-4 max-w-screen-sm md:max-w-none grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
        {/* 第一列：输入和歌单列表 */}
        <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] w-full">
          {/* 输入歌单ID的卡片 */}
          <div className="bg-white rounded-lg border border-gray-300 p-4 md:p-6 shadow-lg mb-4 md:mb-6 w-full">
            <h2 className="text-lg md:text-xl font-semibold mb-4">输入网易云歌单链接/ID</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <input
                type="text"
                value={playlistId}
                onChange={handleInputChange}
                placeholder="请输入歌单链接/ID"
                className="flex-1 rounded-md border border-gray-300 px-2 py-2 focus:border-blue-500 focus:outline-none text-sm md:text-base"
              />
              <button
                onClick={handleFetchPlaylist}
                disabled={loading}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm text-white hover:bg-orange-600 disabled:bg-orange-300 whitespace-nowrap"
              >
                {loading ? '加载中...' : '获取歌单'}
              </button>
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>

          {/* 歌曲列表卡片 */}
          <div className="bg-white rounded-lg border border-gray-300 shadow-lg flex-1 flex flex-col overflow-hidden">
            <div className="p-4 md:p-6 py-3 md:py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-semibold">歌单内容</h2>
                {songs.length > 0 && (
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="rounded-md bg-orange-500 px-3 md:px-4 py-1.5 md:py-2 text-white hover:bg-orange-600 disabled:bg-orange-300 text-sm whitespace-nowrap"
                  >
                    {analyzing ? '分析中...' : '分析曲风'}
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {songs.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {songs.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-3 md:gap-4 p-2 md:p-3 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <img
                        src={song.al.picUrl}
                        alt={song.name}
                        className="h-10 w-10 md:h-12 md:w-12 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm md:text-base truncate">{song.name}</h3>
                        <p className="text-xs md:text-sm text-gray-500 truncate">
                          {song.ar.map(artist => artist.name).join(' / ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center text-sm md:text-base">暂无歌曲，请先输入歌单ID</p>
              )}
            </div>
          </div>
        </div>

        {/* 第二列：分析结果 */}
        <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] w-full">
          <div className="bg-white rounded-lg border border-gray-300 shadow-lg flex-1 flex flex-col overflow-hidden w-full">
            <div className="p-4 md:p-6 py-3 md:py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-lg md:text-xl font-semibold">
                  曲风分析
                  {filteredMusicInfos.length !== musicInfos.length && (
                    <span className="text-xs md:text-sm font-normal text-gray-500 ml-2">
                      (已筛选 {filteredMusicInfos.length}/{musicInfos.length})
                    </span>
                  )}
                </h2>
                {filteredMusicInfos.length > 0 && (
                  <button
                    onClick={handleCopyFilteredSongs}
                    className="px-2 md:px-3 py-1 text-xs md:text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors whitespace-nowrap"
                  >
                    复制歌曲列表
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              { musicInfos.length > 0 ? (
                <div className="space-y-4 md:space-y-6">
                  {filteredMusicInfos.map((info) => (
                    <div key={info.songId} className="border-b border-gray-200 pb-3 md:pb-4 last:border-b-0">
                      <h3 className="font-medium mb-2 text-sm md:text-base">{info.songName}</h3>
                      <div className="space-y-2">
                        {info.style && info.style.length > 0 && (
                          <div className="flex gap-2">
                            <span className="text-gray-500 text-xs md:text-sm">曲风:</span>
                            <div className="flex flex-wrap gap-1 md:gap-2">
                              {info.style.map((style: string) => (
                                <span key={style} className="px-2 py-0.5 md:py-1 bg-orange-100 text-orange-800 rounded-md text-xs md:text-sm">
                                  {style}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {info.tags && info.tags.length > 0 && (
                          <div className="flex gap-2">
                            <span className="text-gray-500 text-xs md:text-sm">标签:</span>
                            <div className="flex flex-wrap gap-1 md:gap-2">
                              {info.tags.map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 md:py-1 bg-blue-100 text-blue-800 rounded-md text-xs md:text-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {info.language && (
                          <div className="flex gap-2">
                            <span className="text-gray-500 text-xs md:text-sm">语种:</span>
                            <span className="text-gray-700 text-xs md:text-sm">{info.language}</span>
                          </div>
                        )}
                        {info.bpm && (
                          <div className="flex gap-2">
                            <span className="text-gray-500 text-xs md:text-sm">BPM:</span>
                            <span className="text-gray-700 text-xs md:text-sm">{info.bpm}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center text-sm md:text-base">
                  {'点击分析按钮开始分析歌曲'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 第三列：筛选选项 */}
        <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] w-full">
          <div className="bg-white rounded-lg border border-gray-300 shadow-lg flex-1 flex flex-col overflow-hidden w-full">
            <div className="p-4 md:p-6 py-3 md:py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg md:text-xl font-semibold">筛选选项</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {analyzing && renderProgressBar()}
              {musicInfos.length > 0 && (
                <div className="space-y-4">
                  {/* 曲风筛选 */}
                  {availableFilters.styles.length > 0 && (
                    <div>
                      <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-2">曲风</h3>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {availableFilters.styles.map((style: string) => (
                          <button
                            key={style}
                            onClick={() => {
                              const newStyles = filterOptions.styles.includes(style)
                                ? filterOptions.styles.filter(s => s !== style)
                                : [...filterOptions.styles, style]
                              handleFilterChange('styles', newStyles)
                            }}
                            className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm transition-colors ${
                              filterOptions.styles.includes(style)
                                ? 'bg-orange-500 text-white'
                                : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 标签筛选 */}
                  {availableFilters.tags.length > 0 && (
                    <div>
                      <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-2">标签</h3>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {availableFilters.tags.map((tag: string) => (
                          <button
                            key={tag}
                            onClick={() => {
                              const newTags = filterOptions.tags.includes(tag)
                                ? filterOptions.tags.filter(t => t !== tag)
                                : [...filterOptions.tags, tag]
                              handleFilterChange('tags', newTags)
                            }}
                            className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm transition-colors ${
                              filterOptions.tags.includes(tag)
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 语种筛选 */}
                  {availableFilters.languages.length > 0 && (
                    <div>
                      <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-2">语种</h3>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {availableFilters.languages.map((language: string) => (
                          <button
                            key={language}
                            onClick={() => {
                              const newLanguages = filterOptions.languages.includes(language)
                                ? filterOptions.languages.filter(l => l !== language)
                                : [...filterOptions.languages, language]
                              handleFilterChange('languages', newLanguages)
                            }}
                            className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm transition-colors ${
                              filterOptions.languages.includes(language)
                                ? 'bg-purple-500 text-white'
                                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                            }`}
                          >
                            {language}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BPM范围筛选 */}
                  {availableFilters.bpmRange && availableFilters.bpmRange.min !== undefined && availableFilters.bpmRange.max !== undefined && (
                    <div>
                      <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-2">
                        BPM范围
                      </h3>
                      <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between text-xs md:text-sm text-gray-500">
                          <span>{bpmDisplayValues.min}</span>
                          <span>{bpmDisplayValues.max}</span>
                        </div>
                        <div className="flex gap-3 md:gap-4 items-center">
                          <input
                            type="range"
                            min={availableFilters.bpmRange.min}
                            max={availableFilters.bpmRange.max}
                            value={filterOptions.bpmRange?.min ?? availableFilters.bpmRange.min}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              setBpmDisplayValues(prev => ({ ...prev, min: value }))
                              handleFilterChange('bpmRange', {
                                min: value,
                                max: filterOptions.bpmRange?.max ?? availableFilters.bpmRange!.max
                              })
                            }}
                            className="flex-1"
                          />
                          <input
                            type="range"
                            min={availableFilters.bpmRange.min}
                            max={availableFilters.bpmRange.max}
                            value={filterOptions.bpmRange?.max ?? availableFilters.bpmRange.max}
                            onChange={(e) => {
                              const value = Number(e.target.value)
                              setBpmDisplayValues(prev => ({ ...prev, max: value }))
                              handleFilterChange('bpmRange', {
                                min: filterOptions.bpmRange?.min ?? availableFilters.bpmRange!.min,
                                max: value
                              })
                            }}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 重置按钮 */}
                  <button
                    onClick={() => {
                      setFilterOptions({
                        styles: [],
                        tags: [],
                        languages: [],
                        bpmRange: null
                      })
                    }}
                    className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors text-sm md:text-base"
                  >
                    重置筛选
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeView
