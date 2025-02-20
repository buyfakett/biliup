import contextvars
import os
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import List

from sqlalchemy import select, desc, delete
from sqlalchemy.orm import sessionmaker, scoped_session, Session
from alembic import command, config

from .models import (
    DB_PATH,
    engine,
    BaseModel,
    StreamerInfo,
    FileList,
)

SessionLocal = sessionmaker(bind=engine, autocommit=False)
# 使用 Context ID 区分会话
# Session = scoped_session(session_factory, scopefunc=lambda: id(contextvars.copy_context()))


def struct_time_to_datetime(date: time.struct_time):
    return datetime.fromtimestamp(time.mktime(date))


def datetime_to_struct_time(date: datetime):
    return time.localtime(date.timestamp())


# class DB:
    """数据库交互类"""

# @classmethod
def init(no_http):
    """初始化数据库"""
    run = not Path.cwd().joinpath("data/data.sqlite3").exists()
    if no_http and not run:
        new_name = f'{DB_PATH}.backup'
        if os.path.exists(new_name):
            os.remove(new_name)
        os.rename(DB_PATH, new_name)
        print(f"旧数据库已备份为: {new_name}")  # 在logger加载配置之前执行，只能使用print
    BaseModel.metadata.create_all(engine)  # 创建所有表
    migrate_via_alembic()
    return run or no_http

# @classmethod
def close(db: Session):
    """ 关闭 Session, 释放连接到连接池 """
    db.close()

# @classmethod
# def remove(db: Session):
#     """ 释放连接, 并删除注册表中的 Session """
#     db.remove()

# @classmethod
def get_stream_info(db: Session, name: str) -> dict:
    """根据 streamer 获取下载信息, 若不存在则返回空字典"""
    res = db.execute(
        select(StreamerInfo).
        filter_by(name=name).
        order_by(desc(StreamerInfo.id))
    ).first()
    if res:
        res = res._asdict()
        res["date"] = datetime_to_struct_time(res["date"])
        return res
    return {}

# @classmethod
def get_stream_info_by_filename(db: Session, filename: str) -> dict:
    """通过文件名获取下载信息, 若不存在则返回空字典"""
    try:
        # stream_info = FileList.get(FileList.file == filename).streamer_info
        stream_info = db.execute(
            select(FileList).
            where(FileList.file == filename)
        ).scalar_one().streamerinfo
        stream_info_dict = stream_info.as_dict()
    except Exception:
        return {}
    stream_info_dict = {key: value for key, value in stream_info_dict.items() if value}  # 清除字典中的空元素
    stream_info_dict["date"] = datetime_to_struct_time(stream_info_dict["date"])  # 将开播时间转回 struct_time 类型
    return stream_info_dict

# @classmethod
def add_stream_info(db: Session, name: str, url: str, date: time.struct_time) -> int:
    """添加下载信息, 返回所添加行的 id """
    streamerinfo = StreamerInfo(
        name=name,
        url=url,
        date=struct_time_to_datetime(date),
        title="",
        live_cover_path="",
    )
    db.add(streamerinfo)
    db.commit()
    return streamerinfo.id

# @classmethod
def delete_stream_info(db: Session, name: str) -> int:
    """根据 streamer 删除下载信息, 返回删除的行数, 若不存在则返回 0 """
    result = db.execute(
        delete(StreamerInfo).where(StreamerInfo.name == name))
    db.commit()
    # db.refresh(result)
    return result.rowcount()

# @classmethod
def delete_stream_info_by_date(db: Session, name: str, date: time.struct_time) -> int:
    """根据 streamer 和开播时间删除下载信息, 返回删除的行数, 若不存在则返回 0 """
    start_datetime = struct_time_to_datetime(date)
    stmt = delete(StreamerInfo).where(
        (StreamerInfo.name == name),
        StreamerInfo.date.between(
            start_datetime - timedelta(minutes=1),
            start_datetime + timedelta(minutes=1)),
    )
    result = db.execute(stmt)
    db.commit()
    return result.rowcount()

# @classmethod
def update_cover_path(db: Session, database_row_id: int, live_cover_path: str):
    """更新封面存储路径"""
    if not live_cover_path:
        live_cover_path = ""
    streamerinfo = Session.scalar(select(StreamerInfo).where(StreamerInfo.id == database_row_id))
    streamerinfo.live_cover_path = live_cover_path
    db.commit()

# @classmethod
def update_room_title(db: Session, database_row_id: int, title: str):
    """更新直播标题"""
    if not title:
        title = ""
    streamerinfo = db.get(StreamerInfo, database_row_id)
    streamerinfo.title = title
    db.commit()

# @classmethod
def update_file_list(db: Session, database_row_id: int, file_name: str) -> int:
    """向视频文件列表中添加文件名"""
    streamer_info = db.get(StreamerInfo, database_row_id)
    file_list = FileList(file=file_name, streamer_info_id=streamer_info.id)
    db.add(file_list)
    db.commit()
    return file_list.id

# @classmethod
def get_file_list(db: Session, database_row_id: int) -> List[str]:
    """获取视频文件列表"""
    file_list = db.get(StreamerInfo, database_row_id).filelist
    return [file.file for file in file_list]

# @classmethod
def migrate_via_alembic():
    """ 自动迁移，通过 alembic 实现 """
    def process_revision_directives(context, revision, directives):
        """ 如果无改变，不生成迁移脚本 """
        script = directives[0]
        if script.upgrade_ops.is_empty():
            directives[:] = []
    alembic_cfg = config.Config()
    # 获取脚本路径
    script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "migration")
    versions_scripts_path = os.path.join(script_path, 'versions')
    if not os.path.exists(versions_scripts_path):
        os.mkdir(versions_scripts_path, 0o700)
    alembic_cfg.set_main_option('script_location', script_path)
    command.stamp(alembic_cfg, 'head', purge=True)  # 将当前标记为最新版
    scripts = command.revision(  # 自动生成迁移脚本
        alembic_cfg,
        autogenerate=True,
        process_revision_directives=process_revision_directives
    )
    if not scripts:
        print("数据库已是最新版本")
        return
    command.upgrade(alembic_cfg, 'head')
    print("检测到旧版数据库，已完成自动迁移")

def backup(db: Session):
    """备份数据库"""
    pass
