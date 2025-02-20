"use client";
import React from "react";
import styles from "../../styles/dashboard.module.scss";
import { Form, Select, Space } from "@douyinfe/semi-ui";
import { IconUpload, IconDownload } from "@douyinfe/semi-icons";

const Global: React.FC = () => {
    return (
        <>
            {/* 全局下载 */}
            <div className={styles.frameDownload}>
                <div className={styles.frameInside}>
                    <div className={styles.group}>
                        <div className={styles.buttonOnlyIconSecond} />
                        <div
                            className={styles.lineStory}
                            style={{
                                color: "var(--semi-color-bg-0)",
                                display: "flex",
                            }}
                        >
                            <IconDownload size="small" />
                        </div>
                    </div>
                    <p className={styles.meegoSharedWebWorkIt}>全局下载设置</p>
                </div>
                <Form.Select
                    label="下载插件（downloader）"
                    field="downloader"
                    placeholder="stream-gears"
                    maxTagCount={3}
                    // initValue="stream-gears"
                    extraText={
                        <div style={{ fontSize: "14px" }}>
                            选择全局默认的下载插件, 可选:
                            <br />
                            1.
                            streamlink（streamlink配合ffmpeg混合下载模式，适合用于下载hls_fmp4与hls_ts流，因为streamlink支持多线程拉取,
                            使用该模式下载flv流时，将会仅使用ffmpeg。请手动安装streamlink以及ffmpeg）
                            <br />
                            2. ffmpeg（纯ffmpeg下载。请手动安装ffmpeg）
                            <br />
                            3. stream-gears（默认）
                        </div>
                    }
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                >
                    <Select.Option value="streamlink">
                        streamlink（混合模式）
                    </Select.Option>
                    <Select.Option value="ffmpeg">ffmpeg</Select.Option>
                    <Select.Option value="stream-gears">
                        stream-gears（默认）
                    </Select.Option>
                </Form.Select>
                <Form.InputNumber
                    label="视频分段大小（file_size）"
                    extraText={
                        <div style={{ fontSize: "14px" }}>
                            录像单文件大小限制，超过此大小分段下载
                            <br />
                            单位：Byte，示例：4294967296（4GB）
                        </div>
                    }
                    field="file_size"
                    placeholder=""
                    suffix={"Byte"}
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                />
                <Form.Input
                    field="segment_time"
                    extraText={
                        <div style={{ fontSize: "14px" }}>
                            录像单文件时间限制，超过此时长分段下载。
                            <br />
                            格式：'00:00:00'（时:分:秒）
                        </div>
                    }
                    label="视频分段时长（segment_time）"
                    placeholder="00:00:00"
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                />
                <Form.InputNumber
                    field="filtering_threshold"
                    extraText={
                        <div style={{ fontSize: "14px" }}>
                            小于此大小的视频文件将会被过滤删除。
                            <br />
                            单位：MB
                        </div>
                    }
                    label="碎片过滤（filtering_threshold）"
                    suffix={"MB"}
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                />

                <Form.InputNumber
                    field="delay"
                    label="下播延迟检测（delay)"
                    extraText={
                        <div style={{ fontSize: "14px" }}>
                            当检测到主播下播后，延迟一定时间再次检测确认，避免特殊情况提早启动上传导致漏录。
                            <br />
                            单位：秒
                            <br />
                            默认延迟时间为 0 秒，若没有快速上传的需求，推荐设置
                            5 分钟（300），或按需设置。
                            <br />
                            若设置的延迟时间超过 60
                            秒，则会启用分段检测机制，每隔 60
                            秒进行一次开播状态的检测。
                        </div>
                    }
                    placeholder="0"
                    suffix="s"
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                />
                <Form.InputNumber
                    field="event_loop_interval"
                    extraText={
                        <div style={{ fontSize: "14px" }}>
                            平台检测间隔时间，如虎牙所有主播检测完后会等待 30
                            秒，再去从新检测
                            <br />
                            单位：秒
                        </div>
                    }
                    label="直播事件检测间隔（event_loop_interval）"
                    suffix="s"
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                />
                <Form.InputNumber
                    field="pool1_size"
                    extraText="负责下载事件的线程池大小。每个下载行为会占用 1 线程，应设置为略大于录制主播总数的数值。"
                    label="下载线程池大小（pool1_size）"
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                />
            </div>

            <Space />

            {/* 全局上传 */}
            <div className={styles.frameUpload}>
                <div className={styles.frameInside}>
                    <div className={styles.group}>
                        <div className={styles.buttonOnlyIconSecond} />
                        <div
                            className={styles.lineStory}
                            style={{
                                color: "var(--semi-color-bg-0)",
                                display: "flex",
                            }}
                        >
                            <IconUpload size="small" />
                        </div>
                    </div>
                    <p className={styles.meegoSharedWebWorkIt}>全局上传设置</p>
                </div>

                <Form.Select
                    field="submit_api"
                    label="提交接口（submit_api）"
                    extraText="B站投稿提交接口，默认为自动选择。"
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                >
                    <Form.Select.Option value="web">
                        网页端（web）
                    </Form.Select.Option>
                    <Form.Select.Option value="client">
                        客户端（client）
                    </Form.Select.Option>
                </Form.Select>
                <Form.Select
                    field="uploader"
                    label="上传插件（uploader）"
                    extraText="全局默认上传插件选择。"
                    placeholder="biliup-rs"
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                >
                    <Form.Select.Option value="bili_web">
                        bili_web
                    </Form.Select.Option>
                    <Form.Select.Option value="biliup-rs">
                        biliup-rs（默认）
                    </Form.Select.Option>
                    <Form.Select.Option value="Noop">
                        Noop（即不上传，但会执行后处理）
                    </Form.Select.Option>
                </Form.Select>
                <Form.Select
                    field="lines"
                    label="上传线路（lines）"
                    extraText="b站上传线路选择，默认为自动模式，目前可手动切换为bda2, kodo, ws, qn"
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                >
                    <Form.Select.Option value="bda2">bda2</Form.Select.Option>
                    <Form.Select.Option value="kodo">kodo</Form.Select.Option>
                    <Form.Select.Option value="ws">ws</Form.Select.Option>
                    <Form.Select.Option value="qn">qn</Form.Select.Option>
                </Form.Select>
                <Form.InputNumber
                    field="threads"
                    extraText="单文件并发上传数，未达到带宽上限时，增大此值可提高上传速度"
                    label="上传并发（threads）"
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                />

                <Form.InputNumber
                    field="pool2_size"
                    extraText={
                        <div style={{ fontSize: "14px" }}>
                            负责上传事件的线程池大小。每个下载行为会占用 1
                            线程，应设置为略大于录制主播总数的数值。
                            <br />
                            若开启 uploading_record ，则需设置为更高的数值
                        </div>
                    }
                    label="上传线程池大小（pool2_size）"
                    style={{ width: "100%" }}
                    fieldStyle={{
                        alignSelf: "stretch",
                        padding: 0,
                    }}
                />
                <Form.Switch
                    field="use_live_cover"
                    extraText={
                        <div style={{ fontSize: "14px" }}>
                            使用直播间封面作为投稿封面。此封面优先级低于单个主播指定的自定义封面，保存于cover文件夹下，上传后自动删除。
                            <br />
                            目前支持平台：哔哩哔哩，Twitch，YouTube。
                        </div>
                    }
                    label="使用直播间封面作为投稿封面（use_live_cover)"
                />
            </div>
        </>
    );
};

export default Global;
