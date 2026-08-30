# Material-UI (MUI) 集成指南

## 安装完成 ✅

已成功将 Material-UI 集成到项目中。

### 已安装的包
- `@mui/material` - 核心组件库
- `@emotion/react` - 样式系统（MUI 依赖）
- `@emotion/styled` - 样式支持
- `@mui/icons-material` - 图标库

## 项目结构

```
src/
├── theme.ts                    # MUI 主题配置
├── main.tsx                    # 集成 ThemeProvider
├── components/
│   ├── muiComponents.tsx       # MUI 组件包装示例
│   ├── MuiDemo.tsx             # 完整组件演示
│   └── ... (其他组件)
```

## 快速开始

### 1. 基础组件使用

```tsx
import { Button, Card, TextField, Box, Typography } from '@mui/material';

export function MyComponent() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h1">标题</Typography>
      <TextField label="输入框" />
      <Button variant="contained" color="primary">
        按钮
      </Button>
    </Box>
  );
}
```

### 2. 布局和网格

```tsx
import { Grid, Container } from '@mui/material';

export function Layout() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          响应式列
        </Grid>
      </Grid>
    </Container>
  );
}
```

### 3. 图标使用

```tsx
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';

export function IconButtons() {
  return (
    <>
      <Button startIcon={<AddIcon />}>添加</Button>
      <Button startIcon={<DeleteIcon />}>删除</Button>
    </>
  );
}
```

## 主题配置

主题配置文件：`src/theme.ts`

已配置的内容：
- 颜色调色板（primary, secondary, background 等）
- 排版样式（字体、大小等）
- 组件默认样式

### 自定义主题色

编辑 `src/theme.ts` 中的 `palette` 配置：

```ts
palette: {
  primary: {
    main: '#2563eb',    // 主色
    light: '#60a5fa',   // 浅色
    dark: '#1d4ed8',    // 深色
  },
  // ... 其他颜色
}
```

## 常用组件

### Button（按钮）
```tsx
<Button variant="contained">主要按钮</Button>
<Button variant="outlined">轮廓按钮</Button>
<Button variant="text">文本按钮</Button>
```

### TextField（输入框）
```tsx
<TextField label="输入框" variant="outlined" />
<TextField error helperText="错误提示" />
```

### Card（卡片）
```tsx
<Card>
  <CardContent>内容</CardContent>
  <CardActions>操作</CardActions>
</Card>
```

### Dialog（对话框）
```tsx
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>标题</DialogTitle>
  <DialogContent>内容</DialogContent>
  <DialogActions>操作按钮</DialogActions>
</Dialog>
```

### Grid（网格布局）
```tsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    xs: 100%, sm: 50%, md: 33.33%
  </Grid>
</Grid>
```

## 响应式设计断点

- `xs`: 0px 及以上（手机）
- `sm`: 600px 及以上（平板竖屏）
- `md`: 960px 及以上（平板横屏）
- `lg`: 1280px 及以上（桌面）
- `xl`: 1920px 及以上（大屏）

## SX Props（样式系统）

MUI 使用 `sx` prop 应用样式，比 Tailwind 更灵活：

```tsx
<Box
  sx={{
    p: 2,                          // padding
    bgcolor: 'primary.main',       // background color
    color: 'white',
    borderRadius: 1,
    '&:hover': {                   // 伪类
      bgcolor: 'primary.dark',
    },
    display: 'flex',
    gap: 2,
    '@media (max-width: 600px)': { // 媒体查询
      p: 1,
    },
  }}
>
  使用 sx prop 应用样式
</Box>
```

## Tailwind CSS 集成注意事项

⚠️ **重要提示**：MUI 和 Tailwind CSS 的样式系统可能产生冲突。

建议：
1. **在新组件中**优先使用 MUI 组件
2. **不建议混用** `className` (Tailwind) 和 `sx` (MUI)
3. 如需混用，使用 `sx` 的优先级更高

```tsx
// ✅ 推荐
<Box sx={{ p: 2, bgcolor: 'primary.main' }}>
  MUI 样式
</Box>

// ❌ 避免
<Box className="p-4 bg-blue-500" sx={{ p: 2 }}>
  混用会导致冲突
</Box>
```

## 下一步

1. **查看演示**: 使用 `MuiDemo` 组件了解所有组件
2. **逐步迁移**: 新组件使用 MUI，旧组件保持现有样式
3. **定制主题**: 根据设计需求调整 `theme.ts`
4. **文档参考**: https://mui.com/

## 常见问题

### Q: 如何自定义组件样式？
```tsx
<Button
  sx={{
    bgcolor: 'custom.color',
    '&:hover': { bgcolor: 'custom.dark' },
  }}
>
  自定义按钮
</Button>
```

### Q: 如何使用自定义字体？
编辑 `theme.ts` 中的 `typography.fontFamily`

### Q: Tailwind 类名还能用吗？
可以，但推荐使用 MUI 的 `sx` 系统以避免冲突。

## 文件位置

- **主题配置**: `src/theme.ts`
- **入口配置**: `src/main.tsx`
- **组件包装**: `src/components/muiComponents.tsx`
- **演示页面**: `src/components/MuiDemo.tsx`
- **原有组件**: `src/components/ui.tsx` (保留作为参考)

---

**开始使用 Material-UI 构建现代化 UI 吧！** 🚀
