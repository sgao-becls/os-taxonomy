/**
 * MUI 组件集成示例
 * 这个文件展示如何使用 Material-UI 组件
 * 可以逐步替换 ui.tsx 中的自定义组件
 */

import React from 'react';
import {
    Button as MuiButton,
    Card as MuiCard,
    CardContent,
    CardHeader,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Chip,
    Box,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

// Button 组件示例
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'error' | 'success';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    children: React.ReactNode;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

export function Button({
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    fullWidth = false,
    children,
    startIcon,
    endIcon,
    ...props
}: ButtonProps) {
    return (
        <MuiButton
            variant={variant}
            color={color}
            size={size}
            fullWidth={fullWidth}
            startIcon={startIcon}
            endIcon={endIcon}
            {...props}
        >
            {children}
        </MuiButton>
    );
}

// Card 组件示例
interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    title?: string;
    header?: React.ReactNode;
    elevation?: number;
}

export function Card({ children, className = '', onClick, title, header, elevation = 1 }: CardProps) {
    return (
        <MuiCard
            elevation={elevation}
            onClick={onClick}
            sx={{
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                '&:hover': onClick ? {
                    elevation: 8,
                    transform: 'translateY(-4px)',
                } : undefined,
            }}
            className={className}
        >
            {header && <CardHeader title={header} />}
            {title && <CardHeader title={title} />}
            <CardContent>{children}</CardContent>
        </MuiCard>
    );
}

// TextField 组件示例
interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
}

export function SearchInput({
    label,
    error = false,
    helperText,
    fullWidth = true,
    ...props
}: SearchInputProps) {
    return (
        <TextField
            label={label}
            error={error}
            helperText={helperText}
            fullWidth={fullWidth}
            variant="outlined"
            size="small"
            slotProps={{
                input: {
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                },
            }}
            {...props}
        />
    );
}

// Dialog 组件示例
interface DialogProps {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    actions?: React.ReactNode;
}

export function ConfirmDialog({ open, title, children, onClose, actions }: DialogProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                {actions || (
                    <>
                        <MuiButton onClick={onClose} variant="outlined">
                            取消
                        </MuiButton>
                        <MuiButton onClick={onClose} variant="contained">
                            确认
                        </MuiButton>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

// Alert 组件示例
interface AlertProps {
    severity?: 'error' | 'warning' | 'info' | 'success';
    message: string;
    onClose?: () => void;
}

export function AlertBox({ severity = 'info', message, onClose }: AlertProps) {
    return (
        <Alert
            severity={severity}
            onClose={onClose}
            sx={{ mt: 2 }}
        >
            {message}
        </Alert>
    );
}

// Loading 组件示例
export function Loading() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
            }}
        >
            <CircularProgress />
        </Box>
    );
}

// Badge/Chip 组件示例
interface ChipProps {
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    onDelete?: () => void;
    icon?: React.ReactNode;
}

export function Badge({ label, color = 'default', onDelete, icon }: ChipProps) {
    return (
        <Chip
            label={label}
            color={color}
            onDelete={onDelete}
            icon={icon}
            variant="outlined"
        />
    );
}
