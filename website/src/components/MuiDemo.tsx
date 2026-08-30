/**
 * MUI 组件使用示例
 * 这个文件展示了 Material-UI 的各种组件用法
 */

import React, { useState } from 'react';
import {
    Container,
    Grid,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    TextField,
    Chip,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export function MuiComponentsDemo() {
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h1" gutterBottom sx={{ mb: 4 }}>
                Material-UI 组件展示
            </Typography>

            {/* Alert 示例 */}
            <Box sx={{ mb: 4 }}>
                <Alert severity="info">
                    这是一个信息提示框，可以使用不同的 severity 类型
                </Alert>
                <Alert severity="success" sx={{ mt: 2 }}>
                    成功！MUI 已成功集成到项目中
                </Alert>
            </Box>

            {/* Button 示例 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" gutterBottom>
                    按钮组件
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="contained" color="primary">
                        主要按钮
                    </Button>
                    <Button variant="outlined" color="primary">
                        轮廓按钮
                    </Button>
                    <Button variant="text" color="primary">
                        文本按钮
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddIcon />}
                    >
                        添加
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        删除
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        startIcon={<EditIcon />}
                    >
                        编辑
                    </Button>
                </Box>
            </Box>

            {/* TextField 示例 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" gutterBottom>
                    输入框组件
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="标签输入框"
                            variant="outlined"
                            placeholder="输入内容..."
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="错误示例"
                            variant="outlined"
                            error
                            helperText="这是一个错误提示"
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Card 示例 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" gutterBottom>
                    卡片组件
                </Typography>
                <Grid container spacing={3}>
                    {[1, 2, 3].map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        卡片标题 {item}
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        这是一个示例卡片
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="textSecondary">
                                        卡片内容描述
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">了解更多</Button>
                                    <Button size="small">共享</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Chip 示例 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" gutterBottom>
                    芯片（标签）组件
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="标签 1" color="primary" variant="outlined" />
                    <Chip label="标签 2" color="secondary" />
                    <Chip label="标签 3" color="success" variant="outlined" />
                    <Chip label="删除我" onDelete={() => { }} />
                </Box>
            </Box>

            {/* Dialog 示例 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" gutterBottom>
                    对话框
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenDialog(true)}
                >
                    打开对话框
                </Button>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>确认操作</DialogTitle>
                    <DialogContent>
                        <Typography>
                            这是一个示例对话框。你确定要继续吗？
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>取消</Button>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            variant="contained"
                            color="primary"
                        >
                            确认
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Loading 示例 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" gutterBottom>
                    加载状态
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <CircularProgress />
                    <CircularProgress color="success" />
                    <CircularProgress color="inherit" />
                    <Button
                        variant="contained"
                        onClick={() => setIsLoading(!isLoading)}
                        disabled={isLoading}
                    >
                        {isLoading ? '加载中...' : '点击加载'}
                    </Button>
                </Box>
            </Box>

            {/* Grid Layout 示例 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" gutterBottom>
                    网格布局
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
                            <CardContent>
                                <Typography>响应式布局</Typography>
                                <Typography>
                                    在手机上占满宽度，平板上占 50%，桌面上占 33.33%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                            <CardContent>
                                <Typography>自适应列</Typography>
                                <Typography>
                                    使用 Grid 系统可以轻松实现响应式设计
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
                            <CardContent>
                                <Typography>灵活布局</Typography>
                                <Typography>
                                    支持 xs, sm, md, lg, xl 等断点
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* 颜色示例 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" gutterBottom>
                    主题颜色
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: 1,
                            }}
                        >
                            主色调（Primary）
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: 'secondary.main',
                                color: 'white',
                                borderRadius: 1,
                            }}
                        >
                            辅助色（Secondary）
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: 'success.main',
                                color: 'white',
                                borderRadius: 1,
                            }}
                        >
                            成功色（Success）
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: 'error.main',
                                color: 'white',
                                borderRadius: 1,
                            }}
                        >
                            错误色（Error）
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
