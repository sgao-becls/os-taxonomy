# MUI 卡片组件迁移指南

## 概览

已为项目创建了优化的 Material-UI 卡片组件，用于替换现有的自定义卡片实现。

## 新增组件

### 📦 文件位置
- **组件定义**: [src/components/MuiCards.tsx](./MuiCards.tsx)
- **使用示例**: [src/components/MuiCardsDemo.tsx](./MuiCardsDemo.tsx)

## 可用的卡片组件

### 1️⃣ ClusterCard（集群卡片）

**用途**: 显示 Computing、Mathematics 等科目下的具体学习集群

**特性**:
- ✅ 显示集群名称、年龄范围、主题数量
- ✅ 支持选中状态高亮
- ✅ 平滑的悬停效果
- ✅ 内置"查看详情"按钮

**替换现有**: `ClusterGrid.tsx` 中的 `ClusterCard`

**使用示例**:
```tsx
import { ClusterCard } from './MuiCards';

<ClusterCard
  cluster={cluster}
  topicCount={6}
  isSelected={false}
  onClick={() => selectCluster(cluster)}
/>
```

**迁移说明**:
- ❌ 删除: `className` 和 Tailwind 样式
- ✅ 新增: `isSelected` 参数自动处理选中状态样式
- ✅ 删除: 不再需要 `subjectColor.bg` 等颜色类

---

### 2️⃣ SubjectCard（科目卡片）

**用途**: 显示 Computing、Mathematics、Science 等科目卡片

**特性**:
- ✅ 大尺寸卡片（320px最小高度）
- ✅ 显示表情符号 + 主题数
- ✅ 渐变色顶部装饰条
- ✅ 平滑的缩放和颜色过渡
- ✅ 响应式设计

**替换现有**: `SubjectsGrid.tsx` 中的 `SubjectCard`

**使用示例**:
```tsx
import { SubjectCard } from './MuiCards';

<SubjectCard
  subject="Computing"
  topicCount={21}
  emoji="💻"
  gradient="linear-gradient(90deg, #2563eb, #06b6d4)"
  onClick={() => selectSubject('Computing')}
/>
```

**迁移说明**:
- ✅ 新增: 接受 `emoji` 参数（不再需要条件判断）
- ✅ 新增: 接受 `gradient` 参数（自定义渐变色）
- ❌ 删除: 所有 Tailwind 类名和条件 className
- ❌ 删除: 手动 SVG 图标，改用 Material-UI Icons

---

### 3️⃣ SearchResultCard（搜索结果卡片）

**用途**: 显示搜索结果中的主题卡片

**特性**:
- ✅ 显示主题名称、域、描述
- ✅ 显示掌握证据
- ✅ 支持"查看详情"和"转到集群"双按钮
- ✅ 响应式布局

**替换现有**: `SearchResults.tsx` 中的卡片

**使用示例**:
```tsx
import { SearchResultCard } from './MuiCards';

<SearchResultCard
  topic={topic}
  onViewDetails={() => selectTopic(topic)}
  onNavigateToCluster={() => navigateToCluster(topic)}
/>
```

---

### 4️⃣ SimpleCard（通用卡片）

**用途**: 通用卡片，用于任何需要卡片容器的场景

**特性**:
- ✅ 支持标题、内容、操作按钮
- ✅ 可选的点击事件
- ✅ 自定义 `sx` 样式
- ✅ 可控的阴影层级

**替换现有**: `ui.tsx` 中的 `Card` 通用组件

**使用示例**:
```tsx
import { SimpleCard } from './MuiCards';

<SimpleCard
  title="Card Title"
  onClick={() => console.log('clicked')}
  action={<button>Action</button>}
>
  Card content here
</SimpleCard>
```

---

## 迁移步骤

### 步骤 1: 在组件中导入新卡片

```tsx
// 旧方式
import { Card, Badge } from './ui';

// 新方式
import { ClusterCard, SubjectCard } from './MuiCards';
import { Chip } from '@mui/material';
```

### 步骤 2: 替换卡片调用

#### ClusterGrid.tsx
```tsx
// 旧代码
<Card onClick={onClick} className={`transition-all cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
  {/* 自定义卡片内容 */}
</Card>

// 新代码
<ClusterCard
  cluster={cluster}
  topicCount={topicsInCluster.length}
  isSelected={selectedCluster?.subject === cluster.subject}
  onClick={onClick}
/>
```

#### SubjectsGrid.tsx
```tsx
// 旧代码
<button className="w-full h-80 group rounded-2xl...">
  {/* 自定义样式内容 */}
</button>

// 新代码
<SubjectCard
  subject={subject}
  topicCount={topicCount}
  emoji={getEmojiForSubject(subject)}
  onClick={() => selectSubject(subject)}
/>
```

#### SearchResults.tsx
```tsx
// 旧代码
<Card onClick={() => selectTopic(topic)}>
  {/* 自定义搜索结果内容 */}
</Card>

// 新代码
<SearchResultCard
  topic={topic}
  onViewDetails={() => selectTopic(topic)}
  onNavigateToCluster={() => navigateToCluster(topic)}
/>
```

### 步骤 3: 移除 className 和样式

- ❌ 删除所有 Tailwind `className`
- ❌ 删除手动 `style` 属性
- ✅ 使用 MUI 组件的内置样式和 `sx` 属性

### 步骤 4: 测试

- 视觉测试：检查卡片样式是否正确
- 交互测试：检查点击、悬停效果
- 响应式测试：检查不同屏幕尺寸下的显示

---

## 完整对比示例

### ClusterCard - 旧 vs 新

**旧实现** (45 行):
```tsx
export function ClusterCard({ cluster, isSelected, onClick }: ClusterCardProps) {
  const { topics } = useAppStore();
  const topicsInCluster = getTopicsForCluster(topics, cluster);
  const ageColor = getAgeRangeColor(cluster.ageRangeStart);
  const subjectColor = getSubjectColor(cluster.subject);

  return (
    <Card
      onClick={onClick}
      className={`transition-all cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
        } ${subjectColor.bg}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={isSelected ? 'primary' : 'gray'}>{cluster.subject}</Badge>
            <Badge>{getAgeLabel(cluster.ageRangeStart, cluster.ageRangeStart + 1)}</Badge>
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${subjectColor.text}`}>{cluster.domain}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">{cluster.summary}</p>
        </div>
        <div className={`text-center px-3 py-2 rounded-lg ${ageColor.bg} min-w-fit`}>
          <div className={`text-2xl font-bold ${ageColor.text}`}>{topicsInCluster.length}</div>
          <div className="text-xs text-gray-600">Topics</div>
        </div>
      </div>
    </Card>
  );
}
```

**新实现** (1 行):
```tsx
<ClusterCard
  cluster={cluster}
  topicCount={topicCount}
  isSelected={isSelected}
  onClick={onClick}
/>
```

✅ **优势**:
- 代码行数减少 95%
- 所有样式集中在 `MuiCards.tsx`
- 易于维护和统一更新
- 自动获得 Material Design 的最佳实践

---

## 颜色和主题集成

### 自定义渐变色

在 `SubjectCard` 中使用自定义渐变色：

```tsx
<SubjectCard
  subject="Computing"
  topicCount={21}
  emoji="💻"
  gradient="linear-gradient(90deg, #2563eb, #06b6d4)"
/>
```

### 与主题系统一致

新卡片组件使用 `theme.ts` 中定义的颜色：

```ts
// src/theme.ts
palette: {
  primary: { main: '#2563eb' },
  secondary: { main: '#06b6d4' },
  // ...
}
```

卡片会自动使用这些颜色，保持视觉一致性。

---

## 常见问题

### Q: 如何自定义卡片样式？

使用 `sx` 属性：

```tsx
<SimpleCard
  title="Custom Card"
  sx={{
    backgroundColor: 'primary.main',
    color: 'white',
    '&:hover': { transform: 'scale(1.05)' },
  }}
>
  Content
</SimpleCard>
```

### Q: 如何保留旧的卡片样式？

旧的 `Card` 组件仍在 `ui.tsx` 中，可以继续使用。但强烈建议迁移到新的 MUI 组件以获得更好的维护性。

### Q: 卡片支持移动端吗？

是的，所有新卡片都使用 MUI 的响应式系统，支持所有屏幕尺寸。

### Q: 能否混用旧卡片和新卡片？

可以，但不推荐。为了保持视觉一致性，应该统一使用一种卡片组件。

---

## 推荐迁移顺序

1. **SubjectsGrid.tsx** - SubjectCard（最独立）
2. **ClusterGrid.tsx** - ClusterCard（依赖较少）
3. **SearchResults.tsx** - SearchResultCard
4. **其他组件** - 根据需要使用 SimpleCard

---

## 需要帮助？

查看以下文件了解更多：
- 组件实现: `src/components/MuiCards.tsx`
- 使用示例: `src/components/MuiCardsDemo.tsx`
- 主题配置: `src/theme.ts`
- MUI 文档: https://mui.com/

---

**开始使用新的 MUI 卡片组件，享受更好的代码维护性和视觉一致性！** 🎨
