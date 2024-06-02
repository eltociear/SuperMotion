// 声明 BaseCommand 接口
import React from 'react';

import { Action } from '~component/cmdk/extension/Action';
import { ActionPanel } from '~component/cmdk/extension/ActionPanel';
import { ExitAndClearSearch } from '~component/cmdk/extension/command/index';
import List from '~component/cmdk/extension/List';

export interface BaseCommand {
  name: string;
  title?: string;
  keywords?: string[];
  description?: string;
  mode?: string;
  icon?: string | React.ReactNode;
  extension?: string;
}

// SimpleCommand 组件
interface SimpleCommandProps extends BaseCommand {
  handle: () => void;
  endAfterRun?: boolean;
}

export const SimpleCommand: React.FC<SimpleCommandProps> = ({ handle, endAfterRun, ...props }) => {
  const finalHandle = endAfterRun
    ? () => {
        handle();
        ExitAndClearSearch();
      }
    : handle;

  return (
    <List.Item
      id={props.name}
      key={props.name}
      title={props.title || props.name}
      {...props}
      onSelect={finalHandle}
      actions={
        <ActionPanel head={props.title}>
          <ActionPanel.Section>
            <Action.ExecuteCommand handle={finalHandle} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};
// PlaceholderCommand 组件
export const PlaceholderCommand: React.FC = () => {
  return <List.Item cls="!hidden" id={'placeholder'} key={'placeholder'} title={'placeholder'} />;
};

export interface NavigatorCommandProps extends BaseCommand {
  url: string;
  openInNewTabByDefault?: boolean; // 默认是否在新标签页中打开
}

export const NavigatorCommand: React.FC<NavigatorCommandProps> = ({ url, ...props }) => {
  const handleCurrentTab = () => {
    Action.GoTo({ url: url, pure: true });
  };
  // 当前标签页打开
  // const handleNewTab = () => Action.OpenTab({ url: url }); // 新标签页打开

  return (
    <List.Item
      id={props.name}
      key={props.name}
      title={props.title || props.name}
      {...props}
      onSelect={handleCurrentTab}
      actions={
        <ActionPanel head={props.title}>
          <ActionPanel.Section title="Navigate">
            <Action.GoTo url={url} />
            <Action.OpenTab url={url} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};