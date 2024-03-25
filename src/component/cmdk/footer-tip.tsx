import React, {useEffect, useState} from 'react';
import {ShootIcon} from '~component/icons';
import {GITHUB_URL} from '~utils/constant';

interface StatusMessage {
    type: 'success' | 'error' | 'loading' | 'default' | 'tip';
    message: string;
}


class StatusObserver {
    private subscribers: Array<(status: StatusMessage) => void> = [];
    private currentStatus: StatusMessage = { type: 'default', message: 'Ready' };

    public subscribe(callback: (status: StatusMessage) => void): () => void {
        this.subscribers.push(callback);
        callback(this.currentStatus); // 立即调用回调以显示当前状态
        return () => this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    private notify(statusData: StatusMessage, duration: number = 3000): void {
        this.currentStatus = statusData;
        this.subscribers.forEach(callback => callback(this.currentStatus));
        if (statusData.type !== 'default') {
            setTimeout(() => this.notify({ type: 'default', message: 'Ready' }), duration);
        }
    }

    public success(message: string, duration = 3000): void {
        this.notify({ type: 'success', message }, duration);
    }

    public error(message: string, duration = 3000): void {
        this.notify({ type: 'error', message }, duration);
    }

    public loading(message: string, duration = 3000): void {
        this.notify({ type: 'loading', message }, duration);
    }

    public updateStatus(type: 'success' | 'error' | 'loading', message: string, duration?: number): void {
        this.notify({ type, message }, duration);
    }
}


export const statusManager = new StatusObserver();

export const footerTip = (type: 'success' | 'error' | 'loading', message: string, duration?: number): void => {
    statusManager.updateStatus(type, message, duration);
};

const StatusNotifications: React.FC = () => {
    const [currentStatus, setCurrentStatus] = useState<StatusMessage>({ type: 'default', message: '' });

    useEffect(() => {
        const unsubscribe = statusManager.subscribe(setCurrentStatus);
        return unsubscribe;
    }, []);

    function handleOpenGithub(): void {
        window.open(GITHUB_URL, '_blank');
    }

    // 监测status并打印
    useEffect(() => {
        console.log(currentStatus);
    }, [currentStatus]);

    return (
        <div className="status-notifications">
            <div key={ currentStatus.type }
                 className={ `notification ${ currentStatus.type }` }>
                { currentStatus.type === 'default' || !currentStatus.message ? (
                    <ShootIcon className="main-logo" onClick={ handleOpenGithub }/>
                ) : (
                    <span>{ currentStatus.message }</span>
                ) }
            </div>
        </div>
    );
};

export default StatusNotifications;