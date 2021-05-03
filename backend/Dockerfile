FROM python

ENV FLASK_APP=app.py
ENV FLASK_ENV=development

WORKDIR /code

COPY Pipfile Pipfile.lock /code/
RUN pip install pipenv && pipenv install --system

COPY . /code/
