'use server';

import { getEngineClient } from '@5minds/processcube_app_sdk/server';

function engine() {
  return getEngineClient();
}

export async function startSampleProcess() {
  await engine().processModels.startProcessInstance({
    processModelId: 'SampleWithAppSDK_Process',
    startEventId: 'StartEvent_1',
    initialToken: {},
  });
}

export async function fetchWaitingUserTasks() {
  const result = await engine().userTasks.query({
    state: 'suspended' as any,
  });
  return result?.userTasks ?? [];
}

export async function fetchUserTaskById(flowNodeInstanceId: string) {
  const tasks = await fetchWaitingUserTasks();
  return tasks.find((t: any) => t.flowNodeInstanceId === flowNodeInstanceId) ?? null;
}

export async function completeUserTask(flowNodeInstanceId: string, userTaskResult: Record<string, any>) {
  await engine().userTasks.finishUserTask(flowNodeInstanceId, userTaskResult as any);
}
