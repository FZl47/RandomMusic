FROM python:slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SUPERUSER_PASSWORD Fazel

RUN mkdir randommusic 

WORKDIR /randommusic

ADD ./project /randommusic

RUN pip install --timeout 100000 --retries 100000 -r requirments.txt gunicorn 


CMD python manage.py makemigrations && \ 
    python manage.py migrate --noinput && \
    python manage.py collectstatic --noinput && \
    python manage.py createsuperuser --noinput --user fzl --email '' ;\
    gunicorn -b 0.0.0.0:5000 --workers 2 Config.wsgi


