local QBCore = exports['qb-core']:GetCoreObject()

Citizen.CreateThread(function ()
    while true do
        local sleep = 1000
        for i = 1, #Config.Coords, 1 do
            local coords = GetEntityCoords(PlayerPedId())
            if #(coords - vector3(Config.Coords[i].x,Config.Coords[i].y,Config.Coords[i].z)) <= 2.0 then
                sleep = 0
                DrawText3D("~INPUT_PICKUP~ - Market", vector3(Config.Coords[i].x,Config.Coords[i].y,Config.Coords[i].z))
                if IsControlJustReleased(0, 38) then
                    OpenUI()
                end
            end
        end
        Wait(sleep)
    end
end)

function OpenUI()
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = "OpenUI",
        Items = Config.Items
    })
end

function CloseNUI()
    SetNuiFocus(false, false)
end

function Satinalindi(data)
    SetNuiFocus(false, false)
    TriggerServerEvent("bo-market-server:additem", data)
end

function Error(data)
    QBCore.Functions.Notify(data, "error", 2000)
end

RegisterNUICallback("Error", Error)
RegisterNUICallback("CloseNUI", CloseNUI)
RegisterNUICallback("Satinalindi", Satinalindi)

DrawText3D = function (msg, coords)
    AddTextEntry('esxFloatingHelpNotification', msg)
    SetFloatingHelpTextWorldPosition(1, coords)
    SetFloatingHelpTextStyle(1, 1, 2, -1, 3, 0)
    BeginTextCommandDisplayHelp('esxFloatingHelpNotification')
    EndTextCommandDisplayHelp(2, false, false, -1)
end