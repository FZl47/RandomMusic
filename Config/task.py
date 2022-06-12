import threading
import asyncio
import time


def test_speed_method(func):
    def wrapper(args):
        t1 = time.time()
        f = func(args)
        t2 = time.time()
        print(round(t2-t1,4))
        return f
    return wrapper


def test_speed(func):
    def wrapper(*args):
        t1 = time.time()
        f = func(*args)
        t2 = time.time()
        print(round(t2-t1,7))
        return f
    return wrapper


class Loop:
    def __init__(self):

        try:
            self.LoopAsync = asyncio.get_event_loop()
        except:
            self.LoopAsync = asyncio.new_event_loop()

        self.COUNT_TASK_IN_QUEUE = 0
        self.TASK_IN_QUEUE = False
        self.QUEUE_LIST_TASK = []
        self.LIST_TASK = []
        self.IS_RUNNING = False

    def add(self,task):
        self.LIST_TASK.append(task)
        return self.LIST_TASK

    def generatorTasks(self):
        # Convert List to Generator
        return (Task for Task in self.LIST_TASK)

    def list_task_clear(self):
        self.LIST_TASK = []

    def completed(self):
        self.IS_RUNNING = False
        self.TASK_IN_QUEUE = False
        self.list_task_clear()

    def start_thread(self):
        if self.IS_RUNNING == False:
            self.IS_RUNNING = True
            def target():
                """
                    Thread
                """
                for Task in self.LIST_TASK:
                    Task._start_thread()

                # Completed All
                self.completed()

            t = threading.Thread(target=target)
            t.start()
            self.THREAD = t
            if self.TASK_IN_QUEUE:
                self.start_thread()
        else:
            self.TASK_IN_QUEUE = True



    def start_thread_async(self):
        if self.IS_RUNNING == False:
        #     self.IS_RUNNING = True
        #
        #     def create_sub_thread():
        #         t2 = threading.Thread(target=sub_target)
        #         t2.start()
        #         self.THREAD = t2
        #         t2.join()
        #
        #     def sub_target():
        #         group = []
        #         for Task in self.LIST_TASK:
        #             group.append(Task._start_thread_async(self))
        #         self.completed()
        #         self.LoopAsync.run_until_complete(asyncio.gather(*group))
        #         group = []
        #
        #     def target():
        #         """
        #             Thread
        #         """
        #         create_sub_thread()
        #     t = threading.Thread(target=target)
        #     t.start()
        #     self.TASK_IN_QUEUE = False
            pass
        else:
            pass


class Task:

    def __init__(self,func,args=()):
        self._func = func
        self.args = args

    def _start_thread(self):
        self._func(*self.args)


    def _start_thread_async(self,LoopObj):
        return LoopObj.LoopAsync.create_task(self._func(*self.args))








