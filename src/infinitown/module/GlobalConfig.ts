
export default class GlobalConfig {
    // FPS
    static readonly FPS: boolean = true;
    // 日志调用
    static readonly LOG_CALLS: boolean = true;
    // 随机种子
    static readonly RANDOM_SEED: string = 'infinitown';
    // 启动随机种子
    static readonly RANDOM_SEED_ENABLED: boolean = false;
    // 最大比率
    static readonly MAX_PIXEL_RATIO: number = 1.25;
    // 地图上影子的解析度
    static readonly SHADOWMAP_RESOLUTION: number = window['isMobile'] ? 1024 : 2048;
    // SHADOWMAP类型
    static readonly SHADOWMAP_TYPE: string = 'SHADOWMAP_TYPE_PCF';
    // 表尺寸
    static readonly TABLE_SIZE: number = 9;
    // 块数量
    static readonly CHUNK_COUNT: number = 9;
    // 块尺寸
    static readonly CHUNK_SIZE: number = 60;
    // 相机角度
    static readonly CAMERA_ANGLE: number = 0.5;
    // 平移速度
    static readonly PAN_SPEED: number = window['isMobile'] ? 0.4 : 0.1;
    // 雾最近的距离
    static readonly FOG_NEAR: number = 225;
    // 雾最远的距离
    static readonly FOG_FAR: number = 325;
    // 雾的颜色，青蓝色
    static readonly FOG_COLOR: number = 0xa2e8ff;
}