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

        self.COUNT_TASK_IN_QUEUE = 0
        self.TASK_IN_QUEUE = False
        self.IS_RUNNING = False
        self.QUEUE_LIST_TASK = []
        self.LIST_TASK = []

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
        self.list_task_clear()

    def start_thread(self):
        if self.IS_RUNNING == False:
            self.IS_RUNNING = True
            def target(loop):
                """
                    Thread
                """
                for Task in loop.LIST_TASK:
                    Task._start_thread()
                # Completed All
                loop.completed()

            t = threading.Thread(target=target,args=(self,),daemon=True)
            t.start()
            self.THREAD = t
            if self.TASK_IN_QUEUE:
                self.TASK_IN_QUEUE = False
                self.start_thread()
        else:
            self.TASK_IN_QUEUE = True



class Task:

    def __init__(self,func,args=()):
        self._func = func
        self.args = args

    def _start_thread(self):
        self._func(*self.args)
